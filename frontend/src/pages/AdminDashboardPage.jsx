import React, { useState, useEffect } from 'react';
import { resolveMediaUrl } from '../services/api';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Image as ImageIcon,
  CheckCircle, XCircle, ArrowUpRight, TrendingUp, AlertTriangle, Plus,
  Edit, Trash2, RefreshCw, Printer, ShieldAlert, Sparkles, DollarSign
} from 'lucide-react';
import { adminApi, metaApi, productApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import InvoiceView from '../components/InvoiceView';

export default function AdminDashboardPage({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const { success, error, warning } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'banners' | 'reviews'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Product Add/Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodModel, setProdModel] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMrp, setProdMrp] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodCatId, setProdCatId] = useState('1');
  const [prodBrandId, setProdBrandId] = useState('1');
  const [prodDesc, setProdDesc] = useState('');
  const [prodShortDesc, setProdShortDesc] = useState('');
  // Uploaded image URLs are stored internally; admins only choose image files.
  const [prodImages, setProdImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [prodVideo, setProdVideo] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);
  const [prodTrending, setProdTrending] = useState(false);

  // Order Status Update Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');
  const [trackingNum, setTrackingNum] = useState('');
  const [courierName, setCourierName] = useState('Delhivery Express');

  // Coupon Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [coupCode, setCoupCode] = useState('');
  const [coupDesc, setCoupDesc] = useState('');
  const [coupType, setCoupType] = useState('FIXED');
  const [coupVal, setCoupVal] = useState('100');
  const [coupMin, setCoupMin] = useState('999');
  const [coupMax, setCoupMax] = useState('500');

  // Printable Invoice Modal
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    loadDashboardData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <section className="min-h-[55vh] flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white rounded-xl shadow-sm border p-8">
          <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-red-600" />
          <h1 className="text-xl font-bold mb-2">Admin access only</h1>
          <p className="text-gray-600">You do not have permission to view or manage this store.</p>
          <button onClick={() => onNavigate('home')} className="mt-5 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold">Back to Store</button>
        </div>
      </section>
    );
  }

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, prodsRes, custRes, coupRes, banRes, revRes, catsRes, brandsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getOrders(),
        productApi.getProducts({ size: 100 }),
        adminApi.getCustomers(),
        adminApi.getCoupons(),
        adminApi.getBanners(),
        adminApi.getReviews(),
        metaApi.getCategories(),
        metaApi.getBrands(),
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data || []);
      setProducts(prodsRes.data?.content || []);
      setCustomers(custRes.data || []);
      setCoupons(coupRes.data || []);
      setBanners(banRes.data || []);
      setReviews(revRes.data || []);
      setCategories(catsRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (err) {
      error('Failed to load some admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPhotoSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    const invalid = files.find(file => !file.type.startsWith('image/'));
    if (invalid) {
      error('Please select image files only');
      return;
    }
    setUploadingImages(true);
    try {
      const uploaded = await adminApi.uploadProductImages(files);
      const newUrls = (uploaded.data || []).filter(Boolean);
      setProdImages(current => [...current, ...newUrls]);
      success(`${newUrls.length} photo${newUrls.length === 1 ? '' : 's'} uploaded successfully`);
    } catch (uploadError) {
      error(uploadError.message || 'Product photo upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeProductPhoto = (index) => {
    setProdImages(current => current.filter((_, photoIndex) => photoIndex !== index));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const urls = prodImages.filter(Boolean);
    if (uploadingImages) {
      warning('Please wait until photo uploads finish');
      return;
    }
    if (!urls.length) {
      error('Please upload at least one product photo');
      return;
    }

    const payload = {
      title: prodTitle,
      slug: prodSlug || prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: prodSku || 'SKU-' + Date.now(),
      modelNumber: prodModel,
      price: Number(prodPrice),
      mrp: Number(prodMrp || prodPrice),
      stockQuantity: Number(prodStock),
      categoryId: prodCatId,
      brandId: prodBrandId,
      description: prodDesc,
      shortDescription: prodShortDesc,
      videoUrl: prodVideo,
      featured: prodFeatured,
      bestSeller: prodBestSeller,
      trending: prodTrending,
      imageUrls: urls
    };

    try {
      if (editingProductId) {
        await adminApi.updateProduct(editingProductId, payload);
        success('Product updated successfully');
      } else {
        await adminApi.createProduct(payload);
        success('New product created and live in catalog!');
      }
      setProductModalOpen(false);
      resetProductForm();
      loadDashboardData();
    } catch (err) {
      error(err.message || 'Error saving product');
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProductId(prod.id);
    setProdTitle(prod.title);
    setProdSlug(prod.slug);
    setProdSku(prod.sku);
    setProdModel(prod.modelNumber || '');
    setProdPrice(String(prod.price));
    setProdMrp(String(prod.mrp || prod.price));
    setProdStock(String(prod.stockQuantity));
    setProdCatId(prod.category?.id || '1');
    setProdBrandId(prod.brand?.id || '1');
    setProdDesc(prod.description || '');
    setProdShortDesc(prod.shortDescription || '');
    setProdVideo(prod.videoUrl || '');
    setProdFeatured(prod.featured || false);
    setProdBestSeller(prod.bestSeller || false);
    setProdTrending(prod.trending || false);
    setProdImages((prod.images || []).map(i => i.imageUrl).filter(Boolean));
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await adminApi.deleteProduct(id);
        success('Product deleted permanently');
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        error(err.message || 'Failed to delete product');
      }
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdTitle(''); setProdSlug(''); setProdSku(''); setProdModel(''); setProdPrice(''); setProdMrp('');
    setProdStock('10'); setProdDesc(''); setProdShortDesc(''); setProdImages([]); setProdVideo('');
    setProdFeatured(false); setProdBestSeller(false); setProdTrending(false);
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      await adminApi.updateOrderStatus(selectedOrder.orderNumber, {
        status: newStatus,
        trackingNumber: trackingNum || selectedOrder.trackingNumber,
        courierName: courierName || selectedOrder.courierName
      });
      success(`Order #${selectedOrder.orderNumber} status updated to ${newStatus}`);
      setStatusModalOpen(false);
      loadDashboardData();
    } catch (err) {
      error(err.message || 'Failed to update order status');
    }
  };

  const handleProcessRefund = async (orderId) => {
    if (window.confirm('Process full refund for this order?')) {
      try {
        await adminApi.processRefund(orderId, 'Authorized by Administrator');
        success('Refund processed and order marked as REFUNDED.');
        loadDashboardData();
      } catch (err) {
        error(err.message || 'Failed to process refund');
      }
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCoupon({
        code: coupCode.toUpperCase().trim(),
        description: coupDesc,
        discountType: coupType,
        discountValue: Number(coupVal),
        minOrderValue: Number(coupMin),
        maxDiscountAmount: Number(coupMax)
      });
      success('Coupon created successfully');
      setCouponModalOpen(false);
      setCoupCode(''); setCoupDesc('');
      loadDashboardData();
    } catch (err) {
      error(err.message || 'Error creating coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await adminApi.deleteCoupon(id);
      success('Coupon deleted');
      setCoupons(coupons.filter(c => c.id !== id));
    } catch {
      error('Failed to delete coupon');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await adminApi.deleteReview(id);
      success('Review removed');
      setReviews(reviews.filter(r => r.id !== id));
    } catch {
      error('Failed to remove review');
    }
  };

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      {/* Admin Navbar Strip */}
      <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amazon-yellow" />
            <span className="font-black text-base tracking-tight">Amazon Seller & Admin Central</span>
            <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded ml-2">
              PORTAL 2.0
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-300">Logged in as: <b>{user?.fullName}</b></span>
            <button
              onClick={() => onNavigate('home')}
              className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-amazon-yellow font-bold transition"
            >
              Exit to Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-8">

        {/* Dashboard Navigation Tabs */}
        <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-sm mb-6 flex items-center gap-1 overflow-x-auto thin-scrollbar text-xs font-bold">
          {[
            { id: 'overview', label: 'Analytics & Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
            { id: 'banners', label: `Banners (${banners.length})`, icon: ImageIcon },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-amazon-navy text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500 block">Total Revenue</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">
                    ₹{Math.round(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  ₹
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500 block">Total Orders</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">
                    {stats?.totalOrders || orders.length}
                  </span>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    Pending: <b>{stats?.pendingOrders || 0}</b>
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500 block">Active Customers</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">
                    {stats?.totalCustomers || customers.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                    100% verified emails
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500 block">Live Products</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">
                    {stats?.totalProducts || products.length}
                  </span>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    In <b>{categories.length}</b> departments
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Sales Chart & Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Monthly Revenue Chart */}
              <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-2 border-b">
                  <h3 className="font-bold text-sm text-gray-900">Monthly Revenue Growth</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Fulfillment Rate: 98.2%
                  </span>
                </div>

                <div className="h-56 flex items-end gap-6 sm:gap-10 pt-4 px-4 justify-between border-b pb-4">
                  {stats?.salesChart && Object.entries(stats.salesChart).map(([month, val], idx) => {
                    const max = 250000;
                    const heightPercent = Math.min(100, Math.round((val / max) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition">
                          ₹{Math.round(val / 1000)}k
                        </span>
                        <div
                          className="w-full bg-gradient-to-t from-amazon-navy to-amazon-yellow rounded-t-md transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-xs font-bold text-gray-700">{month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-sm text-gray-900 pb-2 border-b">Orders by Status</h3>
                <div className="space-y-2">
                  {[
                    { label: 'CONFIRMED', count: orders.filter(o => o.orderStatus === 'CONFIRMED').length, color: 'bg-emerald-500' },
                    { label: 'PROCESSING', count: orders.filter(o => o.orderStatus === 'PROCESSING').length, color: 'bg-amber-500' },
                    { label: 'SHIPPED', count: orders.filter(o => o.orderStatus === 'SHIPPED').length, color: 'bg-blue-500' },
                    { label: 'DELIVERED', count: orders.filter(o => o.orderStatus === 'DELIVERED').length, color: 'bg-purple-500' },
                    { label: 'CANCELLED', count: orders.filter(o => o.orderStatus === 'CANCELLED').length, color: 'bg-rose-500' },
                  ].map((st, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                        <span className="font-semibold text-gray-700">{st.label}</span>
                      </div>
                      <span className="font-bold text-gray-900">{st.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Product Catalog Management</h2>
                <p className="text-xs text-gray-500">Manage up to 7 images, video URLs, pricing, and stock levels</p>
              </div>
              <button
                onClick={() => { resetProductForm(); setProductModalOpen(true); }}
                className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-600 uppercase font-bold">
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Brand</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Flags</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 border rounded p-1 flex items-center justify-center shrink-0 bg-white">
                            <img
                              src={resolveMediaUrl(prod.images?.[0]?.imageUrl || prod.primaryImageUrl)}
                              alt={prod.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1 max-w-xs">{prod.title}</div>
                            <span className="text-[10px] text-gray-500 font-mono">SKU: {prod.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{prod.category?.name}</td>
                      <td className="py-3 px-3 font-semibold text-gray-800">{prod.brand?.name}</td>
                      <td className="py-3 px-3 font-bold text-gray-950">
                        ₹{Math.round(prod.price).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          prod.stockQuantity > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {prod.stockQuantity} units
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1 text-[10px]">
                          {prod.featured && <span className="bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">FEAT</span>}
                          {prod.bestSeller && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">BEST</span>}
                          {prod.trending && <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold">TREND</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProductClick(prod)}
                            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 hover:bg-rose-100 text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Customer Orders</h2>
                <p className="text-xs text-gray-500">Update fulfillment status, manage cancellations, and trigger refunds</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-600 uppercase font-bold">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-900">{ord.customerName}</div>
                        <span className="text-[10px] text-gray-500">{ord.shippingCity}, {ord.shippingPincode}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-950">
                        ₹{Math.round(ord.finalAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          ord.paymentStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          ord.paymentStatus === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          ord.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                          ord.orderStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                          'bg-sky-100 text-sky-800'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setNewStatus(ord.orderStatus);
                              setTrackingNum(ord.trackingNumber || '');
                              setCourierName(ord.courierName || 'Delhivery Express');
                              setStatusModalOpen(true);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded font-bold text-[11px]"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => setInvoiceOrder(ord)}
                            className="p-1 hover:bg-gray-200 text-gray-600 rounded"
                            title="Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          {ord.orderStatus !== 'REFUNDED' && (
                            <button
                              onClick={() => handleProcessRefund(ord.id)}
                              className="text-[10px] font-bold text-rose-600 hover:underline"
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b">Registered Customers</h2>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-600 uppercase font-bold">
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Email Verified</th>
                    <th className="py-3 px-3">Joined Date</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900 block">{c.fullName}</span>
                        <span className="text-gray-500 text-[11px]">{c.email}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{c.phone || 'N/A'}</td>
                      <td className="py-3 px-3 font-semibold">{c.role}</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-700 font-bold">Verified</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {c.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-lg font-bold text-gray-900">Coupons & Promo Codes</h2>
              <button
                onClick={() => setCouponModalOpen(true)}
                className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((cp) => (
                <div key={cp.id} className="p-4 border rounded-xl bg-gray-50 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-sm bg-amber-100 px-2 py-0.5 rounded text-amber-900">
                      {cp.code}
                    </span>
                    <button
                      onClick={() => handleDeleteCoupon(cp.id)}
                      className="text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 font-medium">{cp.description}</p>
                  <div className="text-[11px] text-gray-500">
                    Discount: <b>{cp.discountType === 'PERCENTAGE' ? `${cp.discountValue}%` : `₹${cp.discountValue}`}</b> • Min Order: <b>₹{cp.minOrderValue}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b">Customer Reviews Moderation</h2>
            <div className="divide-y divide-gray-100 text-xs">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{rev.reviewerName}</span>
                      <span className="text-amber-500 font-bold">{rev.rating}★</span>
                      <span className="text-gray-500 text-[11px]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-bold text-gray-800 mt-1">{rev.title}</div>
                    <p className="text-gray-600 mt-0.5">{rev.comment}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-rose-600 hover:bg-rose-50 p-2 rounded shrink-0"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs my-8 max-h-[90vh] overflow-y-auto thin-scrollbar">
            <h3 className="font-bold text-base text-gray-900 pb-2 border-b">
              {editingProductId ? 'Edit Product' : 'Add New Marketplace Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. Apple iPhone 15 Pro 128GB"
                  className="w-full border rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amazon-yellow focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Department / Category</label>
                  <select
                    value={prodCatId}
                    onChange={(e) => setProdCatId(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Brand</label>
                  <select
                    value={prodBrandId}
                    onChange={(e) => setProdBrandId(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={prodMrp}
                    onChange={(e) => setProdMrp(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-bold block mb-1">Product Photos *</label>
                  <label className={`flex flex-col items-center justify-center gap-2 w-full min-h-28 border-2 border-dashed rounded-lg px-4 py-5 cursor-pointer transition ${uploadingImages ? 'bg-gray-100 border-gray-300 cursor-wait' : 'bg-slate-50 border-gray-300 hover:border-amber-500 hover:bg-amber-50'}`}>
                    <ImageIcon className="w-7 h-7 text-gray-500" />
                    <span className="font-bold text-gray-800">{uploadingImages ? 'Uploading photos…' : 'Click to choose product photos'}</span>
                    <span className="text-[11px] text-gray-500">JPG, PNG, WEBP — multiple photos allowed</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={uploadingImages}
                      onChange={handleProductPhotoSelect} className="hidden" />
                  </label>
                  <p className="text-[11px] text-gray-500 mt-1">फोटो चुनते ही सर्वर पर अपलोड होगी और उसका URL अपने-आप सेव करने के लिए तैयार हो जाएगा। URL लिखने का विकल्प नहीं है।</p>
                </div>
                {prodImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {prodImages.map((imageUrl, index) => (
                      <div key={`${imageUrl}-${index}`} className="relative aspect-square rounded-lg border bg-white p-1">
                        <img src={resolveMediaUrl(imageUrl)} alt={`Product ${index + 1}`} className="w-full h-full object-contain rounded" />
                        <button type="button" onClick={() => removeProductPhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow"
                          aria-label="Remove photo"><XCircle className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold block mb-1">Short Description & Bullet Points</label>
                <textarea
                  rows={2}
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  placeholder="Titanium build, A17 Pro chip, 48MP camera..."
                  className="w-full border rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amazon-yellow focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Full technical specifications and features..."
                  className="w-full border rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amazon-yellow focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="accent-amazon-yellow"
                  />
                  <span>Featured Deal</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodBestSeller}
                    onChange={(e) => setProdBestSeller(e.target.checked)}
                    className="accent-amazon-yellow"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodTrending}
                    onChange={(e) => setProdTrending(e.target.checked)}
                    className="accent-amazon-yellow"
                  />
                  <span>Trending</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold rounded-lg text-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {statusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-gray-900 pb-2 border-b">
              Update Order #{selectedOrder.orderNumber}
            </h3>

            <div>
              <label className="font-bold block mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 text-xs"
              >
                <option value="CONFIRMED">CONFIRMED (Payment Verified)</option>
                <option value="PROCESSING">PROCESSING (Packing at Warehouse)</option>
                <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Out with Driver)</option>
                <option value="DELIVERED">DELIVERED (Delivered)</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="RETURNED">RETURNED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">AWB Tracking Number</label>
              <input
                type="text"
                value={trackingNum}
                onChange={(e) => setTrackingNum(e.target.value)}
                placeholder="e.g. DELH891283"
                className="w-full border rounded px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Courier Partner</label>
              <input
                type="text"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                placeholder="e.g. Delhivery Express"
                className="w-full border rounded px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrderStatus}
                className="px-6 py-2 bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold rounded-lg"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-gray-900 pb-2 border-b">Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MEGA500"
                  className="w-full border rounded px-3 py-2 text-xs font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={coupDesc}
                  onChange={(e) => setCoupDesc(e.target.value)}
                  placeholder="e.g. Flat ₹500 discount on orders over ₹3,999"
                  className="w-full border rounded px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Type</label>
                  <select
                    value={coupType}
                    onChange={(e) => setCoupType(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  >
                    <option value="FIXED">Flat Fixed Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={coupVal}
                    onChange={(e) => setCoupVal(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={coupMin}
                    onChange={(e) => setCoupMin(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={coupMax}
                    onChange={(e) => setCoupMax(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold rounded-lg"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setInvoiceOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-sm bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center no-print"
            >
              ✕
            </button>
            <InvoiceView order={invoiceOrder} />
          </div>
        </div>
      )}

    </div>
  );
}
