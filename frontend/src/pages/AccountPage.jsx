import React, { useState, useEffect } from 'react';
import { resolveMediaUrl } from '../services/api';
import {
  User, Package, MapPin, Heart, Bell, Shield, LogOut,
  Truck, CheckCircle, Trash2, Plus, AlertCircle, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { orderApi, userApi, authApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AccountPage({ initialTab = 'profile', onNavigate }) {
  const { user, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address Modal / Form State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  // Password State
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      // Load orders
      setLoadingOrders(true);
      orderApi.getMyOrders()
        .then(res => setOrders(res.data || []))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));

      // Load addresses
      userApi.getAddresses()
        .then(res => setAddresses(res.data || []))
        .catch(() => {});

      // Load notifications
      userApi.getNotifications()
        .then(res => setNotifications(res.data || []))
        .catch(() => {});
    }
  }, [user]);

  const currentUser = user || { fullName: 'Customer', email: 'customer@amazon.com', phone: '9876543210' };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await userApi.addAddress({
        fullName: addrName,
        phone: addrPhone,
        addressLine1: addrLine1,
        addressLine2: addrLine2,
        city: addrCity,
        state: addrState,
        postalCode: addrPin,
        isDefault: addrDefault
      });
      setAddresses([...addresses, res.data]);
      setAddressModalOpen(false);
      success('Address saved successfully');
      setAddrName(''); setAddrPhone(''); setAddrLine1(''); setAddrLine2(''); setAddrCity(''); setAddrState(''); setAddrPin('');
    } catch (err) {
      error(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await userApi.deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
      success('Address deleted');
    } catch {
      error('Failed to delete address');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: currPassword,
        newPassword
      });
      success('Password updated successfully');
      setCurrPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      error(err.message || 'Error updating password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      <div className="max-w-[1200px] mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-amazon-yellow flex items-center justify-center font-bold text-lg">
              {user.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.fullName}</h1>
              <p className="text-xs text-gray-500">{user.email} • {user.phone || 'No phone added'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Navigation (3 cols) */}
          <div className="md:col-span-3 bg-white rounded-xl p-2 sm:p-3 border border-gray-200 shadow-sm flex md:flex-col overflow-x-auto no-scrollbar gap-1 text-xs font-semibold self-start shrink-0">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
              { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
              { id: 'wishlist', label: `Wishlist (${wishlistItems.length})`, icon: Heart },
              { id: 'notifications', label: `Notifications (${notifications.length})`, icon: Bell },
              { id: 'security', label: 'Login & Security', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-auto md:w-full flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-left transition whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-amber-100 text-amber-950 font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content Panel (9 cols) */}
          <div className="md:col-span-9 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <h2 className="text-base font-bold text-gray-900 pb-2 border-b">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-500 block mb-0.5">Full Name</span>
                    <span className="font-bold text-gray-900 text-sm">{user.fullName}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-500 block mb-0.5">Email Address</span>
                    <span className="font-bold text-gray-900 text-sm">{user.email}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-500 block mb-0.5">Mobile Phone</span>
                    <span className="font-bold text-gray-900 text-sm">{user.phone || 'Not added'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-500 block mb-0.5">Account Role</span>
                    <span className="font-bold text-gray-900 text-sm">{user.role}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h2 className="text-base font-bold text-gray-900">Order History</h2>
                  <span className="text-xs text-gray-500">{orders.length} orders placed</span>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-gray-500">Loading your orders...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                        {/* Order Header Strip */}
                        <div className="bg-gray-50 p-3.5 flex flex-wrap items-center justify-between gap-3 border-b text-gray-600">
                          <div className="flex gap-4 sm:gap-8">
                            <div>
                              <span className="block text-[11px]">ORDER PLACED</span>
                              <span className="font-bold text-gray-900">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="block text-[11px]">TOTAL</span>
                              <span className="font-bold text-gray-900">₹{Math.round(ord.finalAmount).toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="block text-[11px]">SHIP TO</span>
                              <span className="font-bold text-gray-900 truncate max-w-[120px]">{ord.customerName}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] block">ORDER # {ord.orderNumber}</span>
                            <button
                              onClick={() => onNavigate('track-order', { orderNumber: ord.orderNumber })}
                              className="text-amazon-link hover:underline font-bold text-xs"
                            >
                              Track package
                            </button>
                          </div>
                        </div>

                        {/* Order Body */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900">
                              Status: <span className="text-amazon-orange uppercase">{ord.orderStatus}</span>
                            </span>
                            <span className="text-gray-500">
                              Payment: <b>{ord.paymentMethod} ({ord.paymentStatus})</b>
                            </span>
                          </div>

                          <div className="divide-y divide-gray-100">
                            {ord.items?.map((item, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 border rounded p-1 flex items-center justify-center shrink-0">
                                    <img src={resolveMediaUrl(item.productImage)} alt={item.productTitle} className="max-h-full max-w-full object-contain" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 line-clamp-1">{item.productTitle}</h4>
                                    <span className="text-gray-500 text-[11px]">Qty: {item.quantity}</span>
                                  </div>
                                </div>
                                <span className="font-bold text-gray-900">
                                  ₹{Math.round(item.totalPrice).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    You haven't placed any orders yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h2 className="text-base font-bold text-gray-900">Saved Addresses</h2>
                  <button
                    onClick={() => setAddressModalOpen(true)}
                    className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border rounded-xl relative space-y-1.5 text-xs">
                      {addr.default && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                          Default Address
                        </span>
                      )}
                      <div className="font-bold text-sm text-gray-900">{addr.fullName}</div>
                      <div className="text-gray-600">{addr.addressLine1}</div>
                      {addr.addressLine2 && <div className="text-gray-600">{addr.addressLine2}</div>}
                      <div className="text-gray-600">{addr.city}, {addr.state} - {addr.postalCode}</div>
                      <div className="text-gray-500 pt-1">Phone: {addr.phone}</div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-rose-600 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 pb-2 border-b">
                  My Wishlist ({wishlistItems.length})
                </h2>

                {wishlistItems.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {wishlistItems.map((prod) => (
                      <div key={prod.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => onNavigate('product-detail', { productId: prod.id, slug: prod.slug })}
                            className="w-16 h-16 border rounded p-1 flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <img
                              src={resolveMediaUrl(prod.images?.[0]?.imageUrl || prod.primaryImageUrl)}
                              alt={prod.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <h4
                              onClick={() => onNavigate('product-detail', { productId: prod.id, slug: prod.slug })}
                              className="font-bold text-gray-900 hover:text-amazon-link cursor-pointer line-clamp-1"
                            >
                              {prod.title}
                            </h4>
                            <span className="font-black text-sm text-gray-950 block mt-0.5">
                              ₹{Math.round(prod.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              addToCart(prod, 1);
                              removeFromWishlist(prod.id);
                            }}
                            className="bg-amazon-gold hover:bg-amazon-goldHover font-bold px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </button>

                          <button
                            onClick={() => removeFromWishlist(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    Your wishlist is empty. Browse products and tap the heart icon to save items!
                  </div>
                )}
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 pb-2 border-b">
                  Notification Center
                </h2>

                {notifications.length > 0 ? (
                  <div className="space-y-2.5">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3.5 bg-gray-50 border rounded-xl text-xs space-y-1">
                        <div className="font-bold text-gray-900 flex items-center justify-between">
                          <span>{notif.title}</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    No new notifications.
                  </div>
                )}
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-4 text-xs max-w-md">
                <h2 className="text-base font-bold text-gray-900 pb-2 border-b">Change Password</h2>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amazon-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amazon-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amazon-yellow focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-6 py-2 rounded-lg text-xs disabled:opacity-50"
                  >
                    {savingPassword ? 'Saving...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* New Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-gray-900">Add New Shipping Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-0.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    className="w-full border rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-0.5">Phone</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full border rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-0.5">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  className="w-full border rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="font-bold block mb-0.5">Address Line 2</label>
                <input
                  type="text"
                  value={addrLine2}
                  onChange={(e) => setAddrLine2(e.target.value)}
                  className="w-full border rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold block mb-0.5">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full border rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-0.5">State</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full border rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-0.5">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addrPin}
                    onChange={(e) => setAddrPin(e.target.value)}
                    className="w-full border rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrDefault}
                  onChange={(e) => setAddrDefault(e.target.checked)}
                  className="accent-amazon-yellow"
                />
                <span>Set as default delivery address</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amazon-yellow font-bold text-gray-950 rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
