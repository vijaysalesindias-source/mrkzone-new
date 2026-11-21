package com.mrkzone.service;

import com.mrkzone.dto.PincodeCheckResponse;
import com.mrkzone.model.DeliveryZone;
import com.mrkzone.repository.DeliveryZoneRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DeliveryService {

    @Value("${mrkzone.warehouse.pincode:400072}")
    private String originPincode;

    @Value("${mrkzone.shipping.free-shipping-threshold:499.0}")
    private Double freeShippingThreshold;

    @Value("${mrkzone.shipping.standard-shipping-charge:40.0}")
    private Double defaultStandardShipping;

    @Value("${mrkzone.shipping.express-shipping-charge:99.0}")
    private Double defaultExpressShipping;

    private final DeliveryZoneRepository deliveryZoneRepository;

    public DeliveryService(DeliveryZoneRepository deliveryZoneRepository) {
        this.deliveryZoneRepository = deliveryZoneRepository;
    }

    public PincodeCheckResponse checkPincode(String pincode, Double cartSubtotal) {
        PincodeCheckResponse response = new PincodeCheckResponse();
        response.setPincode(pincode);
        response.setFreeShippingThreshold(freeShippingThreshold);

        if (pincode == null || !pincode.matches("^[1-9][0-9]{5}$")) {
            response.setServiceable(false);
            response.setMessage("Please enter a valid 6-digit Indian PIN code.");
            return response;
        }

        List<DeliveryZone> zones = deliveryZoneRepository.findByActiveTrue();
        DeliveryZone matchedZone = null;

        for (DeliveryZone zone : zones) {
            if (zone.getPincodePrefixes() != null) {
                String[] prefixes = zone.getPincodePrefixes().split(",");
                for (String pfx : prefixes) {
                    if (pincode.startsWith(pfx.trim())) {
                        matchedZone = zone;
                        break;
                    }
                }
            }
            if (matchedZone != null) break;
        }

        int estimatedDays = 3;
        String zoneName = "National Delivery";
        double standardFee = defaultStandardShipping;
        double expressFee = defaultExpressShipping;
        boolean expressAvail = true;

        if (matchedZone != null) {
            zoneName = matchedZone.getZoneName();
            estimatedDays = matchedZone.getEstimatedDaysMin();
            standardFee = matchedZone.getStandardShippingFee();
            expressFee = matchedZone.getExpressShippingFee();
            expressAvail = matchedZone.isExpressAvailable();
        } else {
            // Heuristic zone determination from Indian pincode first digits
            // 400xxx = Mumbai Local
            if (pincode.startsWith("400")) {
                zoneName = "Mumbai Local (Fast Dispatch)";
                estimatedDays = 1;
                expressAvail = true;
            } else if (pincode.startsWith("40") || pincode.startsWith("41")) {
                zoneName = "Maharashtra Regional";
                estimatedDays = 2;
                expressAvail = true;
            } else if (pincode.startsWith("110") || pincode.startsWith("560") || pincode.startsWith("600") || pincode.startsWith("700") || pincode.startsWith("500")) {
                zoneName = "Metro Cities";
                estimatedDays = 3;
                expressAvail = true;
            } else {
                zoneName = "Rest of India";
                estimatedDays = 4;
                expressAvail = false;
            }
        }

        LocalDate deliveryDate = calculateBusinessDays(LocalDate.now(), estimatedDays);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMM d");
        String formattedDate = deliveryDate.format(formatter);

        boolean freeDelivery = cartSubtotal != null && cartSubtotal >= freeShippingThreshold;

        response.setServiceable(true);
        response.setZoneName(zoneName);
        response.setEstimatedDays(estimatedDays);
        response.setEstimatedDeliveryDate(deliveryDate);
        response.setFormattedDeliveryDate(formattedDate);
        response.setStandardShippingFee(freeDelivery ? 0.0 : standardFee);
        response.setExpressAvailable(expressAvail);
        response.setExpressShippingFee(expressFee);
        response.setFreeDeliveryEligible(freeDelivery);
        response.setMessage(freeDelivery ?
                "FREE Delivery by " + formattedDate + " (Warehouse PIN: " + originPincode + ")" :
                "Delivery by " + formattedDate + " (Charges: ₹" + standardFee + ", FREE above ₹" + freeShippingThreshold + ")");

        return response;
    }

    private LocalDate calculateBusinessDays(LocalDate startDate, int days) {
        LocalDate current = startDate.plusDays(1);
        int added = 0;
        while (added < days) {
            if (current.getDayOfWeek() != DayOfWeek.SUNDAY) {
                added++;
            }
            if (added < days) {
                current = current.plusDays(1);
            }
        }
        return current;
    }
}
