import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function AmazonQuadrantCards({ onNavigate, onOpenAuth }) {
  // 11 Comprehensive Quadrant Card Rows Replicating Amazon.in Screenshots
  const rows = [
    // ROW 1: Back to school & 15% cashback
    {
      id: 'row-1',
      cards: [
        {
          title: "Up to 60% off | Back to school essentials",
          categorySlug: "electronics",
          items: [
            { name: "Drawing & painting supplies", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300", keyword: "stationery" },
            { name: "Rulers & set squares", img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=300", keyword: "stationery" },
            { name: "Lunch boxes & bottles", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300", keyword: "bottle" },
            { name: "School bags & backpacks", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", keyword: "backpack" }
          ]
        },
        {
          title: "Lowest prices on Amazon + Extra 15% cashback",
          categorySlug: "fashion",
          items: [
            { name: "T-shirt & Shirts", tag: "Starting ₹199", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300", keyword: "t-shirt" },
            { name: "Electronics", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", categorySlug: "audio-headphones" },
            { name: "Footwear & Shoes", tag: "Starting ₹299", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", categorySlug: "footwear" },
            { name: "Smart Gadgets", tag: "Starting ₹149", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", categorySlug: "smartwatches" }
          ]
        },
        {
          title: "Lowest prices on Amazon + Extra 15% cashback",
          categorySlug: "home-kitchen",
          items: [
            { name: "Bakeware", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", keyword: "cookware" },
            { name: "Kitchen Storage", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1584990347449-399c5c24e037?w=300", keyword: "kitchen" },
            { name: "Cookware", tag: "Starting ₹199", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", keyword: "cookware" },
            { name: "Kitchen Tools", tag: "Starting ₹149", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300", keyword: "kitchen" }
          ]
        },
        {
          title: "Lowest prices on Amazon + Extra 15% cashback",
          categorySlug: "fashion",
          items: [
            { name: "Men's Fashion", tag: "Under ₹299", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300", categorySlug: "fashion" },
            { name: "Kitchen", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300", categorySlug: "home-kitchen" },
            { name: "Home Decor", tag: "Under ₹399", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300", categorySlug: "home-kitchen" },
            { name: "Accessories", tag: "Starting ₹149", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", categorySlug: "electronics" }
          ]
        }
      ]
    },

    // ROW 2: Mobile accessories, Bazaar, Earbuds & Office electronics (Image 1 top)
    {
      id: 'row-2',
      cards: [
        {
          title: "Up to 70% off | Best deals on mobile accessories",
          categorySlug: "smartphones",
          items: [
            { name: "Oneplus | Up to 45% off", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", keyword: "OnePlus" },
            { name: "Samsung | Up to 70%...", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300", keyword: "Samsung" },
            { name: "Apple | Up to 20% off", img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300", keyword: "Apple" },
            { name: "Ambrane | Up to 50% off", img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300", keyword: "charger" }
          ]
        },
        {
          title: "Lowest prices on Amazon + Extra 15% cashback",
          categorySlug: "home-kitchen",
          items: [
            { name: "Closet organizers", tag: "Under ₹299", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", keyword: "storage" },
            { name: "Home decor", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300", keyword: "decor" },
            { name: "Bedsheets & pillows", tag: "Starting ₹109", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=300", keyword: "bedsheet" },
            { name: "Shop all Bazaar", tag: "Up to ₹100 Cashback", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300", deals: true }
          ]
        },
        {
          title: "Up to 75% off | Most loved earbuds, neckbands & more",
          categorySlug: "audio-headphones",
          items: [
            { name: "Truly wireless earbuds", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", keyword: "earbuds" },
            { name: "Bluetooth Neckbands", img: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=300", keyword: "neckband" },
            { name: "Over ear headphones", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300", keyword: "headphones" },
            { name: "Wired earphones", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", keyword: "earphones" }
          ]
        },
        {
          title: "Buy office electronics at wholesale prices + 10% cashback",
          categorySlug: "laptops-computers",
          items: [
            { name: "Up to 50% off on Desktops", img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300", keyword: "computer" },
            { name: "Up to 40% off on Laptops", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300", keyword: "laptop" },
            { name: "Up to 60% off on Printers", img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300", keyword: "printer" },
            { name: "For Business purchases", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300", keyword: "office" }
          ]
        }
      ]
    },

    // ROW 3: Stay fit, Wedding gifts, Footwear under budget & Beauty (Image 1 bottom)
    {
      id: 'row-3',
      cards: [
        {
          title: "Starting ₹299 | Stay fit, stay healthy",
          categorySlug: "smartwatches",
          items: [
            { name: "Electric toothbrushes", img: "https://images.unsplash.com/photo-1559591937-e62057200a40?w=300", keyword: "toothbrush" },
            { name: "Weighing scales", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300", keyword: "scale" },
            { name: "Fitness trackers", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", categorySlug: "smartwatches" },
            { name: "Grooming trimmers", img: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=300", keyword: "trimmer" }
          ]
        },
        {
          title: "Bring joy with the perfect wedding gifts",
          categorySlug: "home-kitchen",
          items: [
            { name: "Dinner set", img: "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=300", keyword: "dinner" },
            { name: "Kitchen appliances", img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300", keyword: "mixer" },
            { name: "Jewellery sets", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300", keyword: "jewellery" },
            { name: "Smart gift hampers", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", deals: true }
          ]
        },
        {
          title: "Under budget | Footwear, wallets & more",
          categorySlug: "footwear",
          items: [
            { name: "Footwear | Under ₹499", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", categorySlug: "footwear" },
            { name: "Bags & wallets | Under ₹299", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300", keyword: "wallet" },
            { name: "Belts & accessories", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", keyword: "belt" },
            { name: "Sport shoes & sneakers", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300", categorySlug: "footwear" }
          ]
        },
        {
          title: "Everything under ₹499 | Shop beauty & makeup",
          categorySlug: "fashion",
          items: [
            { name: "Skincare", tag: "Under ₹499", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300", keyword: "skincare" },
            { name: "Makeup", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300", keyword: "makeup" },
            { name: "Fragrances & mists", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300", keyword: "perfume" },
            { name: "Handbags & clutches", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300", keyword: "handbag" }
          ]
        }
      ]
    },

    // ROW 4: Style your look, Stores, Innerwear & Best of home (Image 2 top)
    {
      id: 'row-4',
      cards: [
        {
          title: "Style your look | Starting ₹299",
          categorySlug: "fashion",
          items: [
            { name: "Hair dryers", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", keyword: "dryer" },
            { name: "Hair straighteners", img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=300", keyword: "straightener" },
            { name: "Hair stylers", img: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300", keyword: "styler" },
            { name: "Lipsticks & more", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300", keyword: "lipstick" }
          ]
        },
        {
          title: "Lowest prices on Amazon + Extra 15% cashback",
          categorySlug: "fashion",
          items: [
            { name: "Under ₹99 store", tag: "Under ₹99", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300", deals: true },
            { name: "Under ₹199 store", tag: "Under ₹199", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300", deals: true },
            { name: "Under ₹299 store", tag: "Under ₹299", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", deals: true },
            { name: "Shop all Bazaar", tag: "Up to ₹100 Cashback", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300", deals: true }
          ]
        },
        {
          title: "Minimum 60% off | Innerwear for all",
          categorySlug: "fashion",
          items: [
            { name: "Briefs, trunks & more", img: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=300", keyword: "cotton" },
            { name: "Bra, briefs & more", img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300", keyword: "apparel" },
            { name: "Kids' innerwear", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300", keyword: "kids" },
            { name: "Men's cotton briefs", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300", keyword: "men" }
          ]
        },
        {
          title: "Under ₹499 | Best of home products",
          categorySlug: "home-kitchen",
          items: [
            { name: "Wall clocks", img: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300", keyword: "clock" },
            { name: "Pillows & cushions", img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300", keyword: "pillow" },
            { name: "Floor mats", img: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=300", keyword: "mat" },
            { name: "Candles", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300", keyword: "candle" }
          ]
        }
      ]
    },

    // ROW 5: Mobile accessories, Stationery, Fitness & Bestselling Devices (Image 2 bottom)
    {
      id: 'row-5',
      cards: [
        {
          title: "Up to 75% off | Best deals on mobile accessories",
          categorySlug: "smartphones",
          items: [
            { name: "Samsung | Up to 35%...", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", keyword: "Samsung" },
            { name: "Daily Objects | Up to 70%...", img: "https://images.unsplash.com/photo-1601593346740-925612772716?w=300", keyword: "case" },
            { name: "Power banks", img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300", keyword: "charger" },
            { name: "Screen protectors", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300", keyword: "glass" }
          ]
        },
        {
          title: "Stationery, office products, Arts & crafts",
          categorySlug: "electronics",
          items: [
            { name: "Arts & crafts", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300", keyword: "art" },
            { name: "Ink & ball pens", img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300", keyword: "pen" },
            { name: "Sticky notes & paper", img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300", keyword: "notebook" },
            { name: "Whiteboards & markers", img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=300", keyword: "stationery" }
          ]
        },
        {
          title: "Starting ₹99 | Handpicked sports & fitness essentials",
          categorySlug: "smartwatches",
          items: [
            { name: "Cycles & gear", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300", keyword: "cycle" },
            { name: "Cricket equipment", tag: "Starting ₹249", img: "https://images.unsplash.com/photo-1531415074868-036b107e775a?w=300", keyword: "cricket" },
            { name: "Badminton", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300", keyword: "badminton" },
            { name: "Gym & fitness weights", img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300", keyword: "gym" }
          ]
        },
        {
          title: "Bestselling Devices",
          categorySlug: "electronics",
          items: [
            { name: "Kindle Paperwhite | ₹12,999", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300", keyword: "kindle" },
            { name: "Amazon Echo Show 8", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300", keyword: "echo" },
            { name: "Amazon Echo Dot", img: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300", keyword: "alexa" },
            { name: "Amazon Echo Studio", img: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=300", keyword: "speaker" }
          ]
        }
      ]
    },

    // ROW 6: Dry fruits, Baby sleep, Kitchen deals & Printers/routers (Image 3)
    {
      id: 'row-6',
      cards: [
        {
          title: "Starting ₹199 | Dry fruits & seeds",
          categorySlug: "home-kitchen",
          items: [
            { name: "Almonds", img: "https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=300", keyword: "almond" },
            { name: "Dates", img: "https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=300", keyword: "dates" },
            { name: "Cashews", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300", keyword: "cashew" },
            { name: "Chia seeds", img: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=300", keyword: "seeds" }
          ]
        },
        {
          title: "Up to 60% off | Baby sleep essentials",
          categorySlug: "home-kitchen",
          items: [
            { name: "Baby bedding sets", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300", keyword: "baby" },
            { name: "Blankets & swaddles", img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300", keyword: "blanket" },
            { name: "Cots & cribs", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300", keyword: "crib" },
            { name: "Soft toys", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300", keyword: "toy" }
          ]
        },
        {
          title: "Starting ₹99 | Kitchen deals | Amazon Brands & more",
          categorySlug: "home-kitchen",
          items: [
            { name: "Water bottles & flasks", tag: "Starting ₹149", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300", keyword: "bottle" },
            { name: "Cookware & frypans", tag: "Starting ₹299", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", keyword: "cookware" },
            { name: "Kitchen steamers", tag: "Min. 40% off", img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300", keyword: "appliance" },
            { name: "Choppers & slicers", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300", keyword: "chopper" }
          ]
        },
        {
          title: "Up to 60% off | Bestselling Printers & routers",
          categorySlug: "laptops-computers",
          items: [
            { name: "Printers for occasional use", img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300", keyword: "printer" },
            { name: "All-in-One ink tank printers", img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300", keyword: "printer" },
            { name: "WiFi Adapters", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300", keyword: "wifi" },
            { name: "Routers for streaming", img: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=300", keyword: "router" }
          ]
        }
      ]
    },

    // ROW 7: Top styles, Alexa+ deals, Headphone brands (Image 4 top)
    {
      id: 'row-7',
      cards: [
        {
          title: "Under ₹499 | Top offers on top styles",
          categorySlug: "fashion",
          items: [
            { name: "Kurtas & sets", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300", keyword: "kurta" },
            { name: "Dresses & jumpsuits", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300", keyword: "dress" },
            { name: "T-shirts & polos", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300", keyword: "polo" },
            { name: "Formalwear", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300", keyword: "formal" }
          ]
        },
        {
          title: "Deals that unlock Alexa+",
          categorySlug: "electronics",
          items: [
            { name: "Fire TV Stick HD | Fast...", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300", keyword: "fire tv" },
            { name: "Echo Dot (5th Gen) | Vi...", img: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300", keyword: "echo" },
            { name: "Fire TV Stick 4K Plus", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300", keyword: "4k" },
            { name: "Echo Spot | Powerful sound", img: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=300", keyword: "spot" }
          ]
        },
        {
          title: "Starting ₹149 | Your favourite headphone brands",
          categorySlug: "audio-headphones",
          items: [
            { name: "boAt", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300", keyword: "boat" },
            { name: "Boult Audio", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", keyword: "boult" },
            { name: "Noise", img: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=300", keyword: "noise" },
            { name: "Zebronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", keyword: "zebronics" }
          ]
        },
        {
          title: "Starting ₹149 | Headphones from most loved brands",
          categorySlug: "audio-headphones",
          items: [
            { name: "boAt | Starting ₹349", img: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=300", keyword: "boat" },
            { name: "Hungama HiLife | Start...", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", keyword: "neckband" },
            { name: "Boult Audio | Starting...", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300", keyword: "boult" },
            { name: "Zebronics | Starting ₹1...", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", keyword: "headphones" }
          ]
        }
      ]
    },

    // ROW 8: Bazaar kurtis, Outdoor adventures, Plush toys & Clean home (Image 4 bottom)
    {
      id: 'row-8',
      cards: [
        {
          title: "Lowest prices on Amazon + Extra 15% cashback",
          categorySlug: "fashion",
          items: [
            { name: "Kurtis", tag: "Starting ₹149", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300", keyword: "kurti" },
            { name: "Sarees", tag: "Starting ₹159", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300", keyword: "saree" },
            { name: "Beauty accessories", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300", keyword: "beauty" },
            { name: "Shop all Bazaar", tag: "Up to ₹100 Cashback", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300", deals: true }
          ]
        },
        {
          title: "Starting ₹199 | Unlock outdoor adventure",
          categorySlug: "electronics",
          items: [
            { name: "Blasters & toy guns", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300", keyword: "blaster" },
            { name: "Electric ride-ons", img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=300", keyword: "ride-on" },
            { name: "Bikes, tricycles & more", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300", keyword: "tricycle" },
            { name: "Slides & swings", img: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=300", keyword: "slide" }
          ]
        },
        {
          title: "Starting ₹169 | Toddler toys, plush & more",
          categorySlug: "electronics",
          items: [
            { name: "Dolls & dollhouses", tag: "Starting ₹299", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300", keyword: "doll" },
            { name: "Toddler toys", tag: "Starting ₹169", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300", keyword: "toddler" },
            { name: "Plushies", tag: "Starting ₹169", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300", keyword: "plushie" },
            { name: "Building block sets", tag: "Starting ₹299", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300", keyword: "lego" }
          ]
        },
        {
          title: "Clean, fix & upgrade your home",
          categorySlug: "home-kitchen",
          items: [
            { name: "Cleaning mops", tag: "Starting ₹49", img: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300", keyword: "mop" },
            { name: "Plugs & adapters", tag: "Starting ₹149", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300", keyword: "plug" },
            { name: "Hand tool sets", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=300", keyword: "tools" },
            { name: "Aluminium ladders", tag: "Starting ₹1,499", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300", keyword: "ladder" }
          ]
        }
      ]
    },

    // ROW 9: Alexa+ Early Access, Keyboard & Mouse, Cameras, Customer Fashion (Image 5)
    {
      id: 'row-9',
      cards: [
        {
          title: "Buy any Echo or Fire TV, unlock Alexa+ Early Access",
          categorySlug: "electronics",
          items: [
            { name: "Fire TV Stick HD with...", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300", keyword: "fire tv" },
            { name: "Echo Dot (5th Gen) with...", img: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300", keyword: "echo" },
            { name: "Echo Show 5 with Alexa+", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300", keyword: "show" },
            { name: "Fire TV Stick 4K Select...", img: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=300", keyword: "alexa" }
          ]
        },
        {
          title: "Deals on keyboard, mouse & more",
          categorySlug: "laptops-computers",
          items: [
            { name: "Keyboard", tag: "Starting ₹199", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300", keyword: "keyboard" },
            { name: "Mouse", tag: "Starting ₹109", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300", keyword: "mouse" },
            { name: "Laptop bag", tag: "Starting ₹299", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", keyword: "backpack" },
            { name: "PC Headset", tag: "Starting ₹199", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300", keyword: "headset" }
          ]
        },
        {
          title: "Business pricing on Cameras + Up to 18% GST credit",
          categorySlug: "electronics",
          items: [
            { name: "Dash cameras | Up to...", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300", keyword: "camera" },
            { name: "Mirrorless cameras | U...", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300", keyword: "sony" },
            { name: "Action cameras | Up to...", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300", keyword: "action" },
            { name: "10% Assured cashback", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300", deals: true }
          ]
        },
        {
          title: "Customers' Most-Loved Fashion for you",
          categorySlug: "footwear",
          items: [
            { name: "Puma sneakers", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", keyword: "sneakers" },
            { name: "Casual t-shirt", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300", keyword: "t-shirt" },
            { name: "Skechers walking shoes", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300", keyword: "shoes" },
            { name: "Sparx running shoes", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300", keyword: "running" }
          ]
        }
      ]
    },

    // ROW 10: Exclusive TVs, Most Loved, RC Cars & Home Improvement (Image 6)
    {
      id: 'row-10',
      cards: [
        {
          title: "Latest TVs from your favourite brands | Amazon Exclusive",
          categorySlug: "electronics",
          items: [
            { name: "Xiaomi QLED TV", img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300", keyword: "tv" },
            { name: "Lumio Vision 9 4K TV", img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300", keyword: "4k" },
            { name: "Samsung QLED TV", img: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300", keyword: "samsung" },
            { name: "Xiaomi 4K TV", img: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=300", keyword: "tv" }
          ]
        },
        {
          title: "Customers' Most-Loved products",
          categorySlug: "home-kitchen",
          items: [
            { name: "Water filter candle", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", keyword: "filter" },
            { name: "Incense dhoop gift boxes", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300", keyword: "dhoop" },
            { name: "Pop-up toaster", img: "https://images.unsplash.com/photo-1584990347449-399c5c24e037?w=300", keyword: "toaster" },
            { name: "Food net cover", img: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=300", keyword: "kitchen" }
          ]
        },
        {
          title: "Starting ₹199 | Deals on RC cars & more",
          categorySlug: "electronics",
          items: [
            { name: "RC cars", img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=300", keyword: "rc" },
            { name: "Toy airplanes", img: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=300", keyword: "airplane" },
            { name: "Toy buses", img: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=300", keyword: "bus" },
            { name: "Motor vehicle playsets", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300", keyword: "vehicle" }
          ]
        },
        {
          title: "Up to 80% off on Home improvements + 10% Assured ca...",
          categorySlug: "home-kitchen",
          items: [
            { name: "Electrical & accessories...", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300", keyword: "switch" },
            { name: "Ladders | Up to 50% off", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300", keyword: "ladder" },
            { name: "Security cameras | Up to...", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300", keyword: "camera" },
            { name: "Amazon Business", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300", deals: true }
          ]
        }
      ]
    },

    // ROW 11: Fast streaming, Healthy smiles, Household needs & Home essentials (Image 7)
    {
      id: 'row-11',
      cards: [
        {
          title: "Fast, smooth streaming & Alexa+ smart voice search",
          categorySlug: "electronics",
          items: [
            { name: "Fire TV Stick HD | Fast...", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300", keyword: "fire tv" },
            { name: "Fire TV Stick 4K Plus | ...", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300", keyword: "4k" },
            { name: "Fire TV Stick 4K Select...", img: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=300", keyword: "alexa" },
            { name: "Deals that unlock Alexa+", img: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300", deals: true }
          ]
        },
        {
          title: "Healthy smiles | Starting ₹299",
          categorySlug: "home-kitchen",
          items: [
            { name: "Electric toothbrushes...", img: "https://images.unsplash.com/photo-1559591937-e62057200a40?w=300", keyword: "toothbrush" },
            { name: "Flossers & more", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300", keyword: "flosser" },
            { name: "Kids electric toothbrush...", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300", keyword: "kids" },
            { name: "Brush heads & more", img: "https://images.unsplash.com/photo-1559591937-e62057200a40?w=300", keyword: "brush" }
          ]
        },
        {
          title: "Up to 60% off | Household needs for your family",
          categorySlug: "home-kitchen",
          items: [
            { name: "Laundry & cleaners | U...", img: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300", keyword: "cleaner" },
            { name: "Tea, coffee & beverage...", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300", keyword: "tea" },
            { name: "Baby diapers & wipes | ...", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300", keyword: "diaper" },
            { name: "Snacks, biscuits & mor...", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300", keyword: "snacks" }
          ]
        },
        {
          title: "All under ₹499 | Home essentials",
          categorySlug: "home-kitchen",
          items: [
            { name: "Home storage", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300", keyword: "storage" },
            { name: "Home decor", tag: "Starting ₹139", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300", keyword: "decor" },
            { name: "Bedsheets & pillow cov...", tag: "Starting ₹99", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=300", keyword: "bedsheet" },
            { name: "Explore more", tag: "All under ₹499", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300", deals: true }
          ]
        }
      ]
    }
  ];

  const handleCardClick = (card) => {
    if (card.categorySlug) {
      onNavigate('listing', { categorySlug: card.categorySlug });
    } else if (card.keyword) {
      onNavigate('listing', { keyword: card.keyword });
    } else {
      onNavigate('listing', { deals: true });
    }
  };

  const handleItemClick = (item, card) => {
    if (item.keyword) {
      onNavigate('listing', { keyword: item.keyword, categorySlug: item.categorySlug || card.categorySlug });
    } else if (item.categorySlug) {
      onNavigate('listing', { categorySlug: item.categorySlug });
    } else if (item.deals) {
      onNavigate('listing', { deals: true });
    } else {
      onNavigate('listing', { keyword: item.name });
    }
  };

  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <div key={row.id} className="max-w-[1500px] mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {row.cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {/* Header with Chevron */}
                <button
                  onClick={() => handleCardClick(card)}
                  className="text-left group flex items-start justify-between gap-1 mb-3 cursor-pointer"
                >
                  <h3 className="text-base sm:text-[17px] font-bold text-[#0f1111] leading-snug group-hover:text-[#007185] transition">
                    {card.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-700 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 2x2 Image Grid */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  {card.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      onClick={() => handleItemClick(item, card)}
                      className="cursor-pointer group/item flex flex-col"
                    >
                      {/* Photo Container */}
                      <div className="relative h-28 bg-[#f7f8f8] rounded-md overflow-hidden flex items-center justify-center p-1.5 border border-gray-100">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="eager"
                          className="max-h-full max-w-full object-cover group-hover/item:scale-105 transition-transform duration-300 rounded"
                        />

                        {/* Signature Amazon Yellow/Orange Price Badge */}
                        {item.tag && (
                          <div className={`absolute bottom-1 right-1 font-black text-[9px] px-1.5 py-0.5 rounded shadow-md leading-none border ${
                            item.tag.includes('All under') || item.tag.includes('Under ₹499')
                              ? 'bg-[#cc0c39] text-white border-rose-600'
                              : 'bg-[#ffd814] text-gray-950 border-amber-400'
                          }`}>
                            {item.tag}
                          </div>
                        )}
                      </div>

                      {/* Item Label */}
                      <span className="text-[12px] text-[#0f1111] font-normal leading-tight mt-1 line-clamp-1 group-hover/item:text-[#007185]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Explore Link */}
                <button
                  onClick={() => handleCardClick(card)}
                  className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium text-left pt-2 mt-auto cursor-pointer"
                >
                  See all offers
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
