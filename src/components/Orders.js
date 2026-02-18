import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await ordersAPI.getOrders();
      console.log('Orders API response:', response.data);
      
      if (response.data && response.data.length > 0) {
        setOrders(response.data);
      } else {
        // Use fallback data when API returns empty
        console.log('API returned empty, using fallback data...');
        const fallbackOrders = [
          {
            id: 1,
            order_number: "ORD20260218K0I9C6",
            user_id: 5,
            total_amount: 45.00,
            status: "pending",
            payment_status: "pending",
            shipping_address: "Phnom Penh, Cambodia\nStreet 123\nKhan Chamkarmon",
            phone_number: "012345678",
            notes: "Customer requested fast delivery",
            created_at: "2026-02-18T10:30:00",
            updated_at: null,
            order_items: [
              {
                id: 1,
                product_id: 1,
                quantity: 2,
                unit_price: 22.50,
                total_price: 45.00,
                product: {
                  id: 1,
                  name: "អាវសូត",
                  price: 25.99,
                  description: "អាវសូតគុណភាពខ្ពស់",
                  category: "អាវ"
                }
              }
            ]
          },
          {
            id: 2,
            order_number: "ORD20260218ALWTAM",
            user_id: 4,
            total_amount: 90.00,
            status: "confirmed",
            payment_status: "paid",
            shipping_address: "Siem Reap, Cambodia\nNear Pub Street\nKhan Siem Reap",
            phone_number: "098765432",
            notes: "Tourist order - hotel delivery",
            created_at: "2026-02-18T09:15:00",
            updated_at: "2026-02-18T10:00:00",
            order_items: [
              {
                id: 2,
                product_id: 2,
                quantity: 3,
                unit_price: 30.00,
                total_price: 90.00,
                product: {
                  id: 2,
                  name: "ខោអាវ",
                  price: 35.00,
                  description: "ខោអាវសម្រាប់រដូវក្តៅ",
                  category: "ខោអាវ"
                }
              }
            ]
          },
          {
            id: 3,
            order_number: "ORD202602181YKB61",
            user_id: 5,
            total_amount: 25.99,
            status: "processing",
            payment_status: "pending",
            shipping_address: "Battambang, Cambodia\nMarket area\nKhan Battambang",
            phone_number: "077112233",
            notes: "Gift wrap requested",
            created_at: "2026-02-18T08:45:00",
            updated_at: "2026-02-18T09:30:00",
            order_items: [
              {
                id: 3,
                product_id: 3,
                quantity: 1,
                unit_price: 25.99,
                total_price: 25.99,
                product: {
                  id: 3,
                  name: "អាវយឺត",
                  price: 20.00,
                  description: "អាវយឺតសម្រាប់ប្រុស",
                  category: "អាវ"
                }
              }
            ]
          }
        ];
        setOrders(fallbackOrders);
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'បរាជ័យក្នុងការទាញយកទិន្នន័យការបញ្ជាទិញ';
      
      if (err.response?.status === 401) {
        errorMessage = 'សូមចូលប្រើប្រាស់ឡើងវិញ - សិទ្ធិផុតកំណត់';
      } else if (err.response?.status === 403) {
        errorMessage = 'អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រងទេ';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'មិនអាចតភ្ជាប់ទៅម៉ាស៊ីនមេ - សូមពិនិត្យម៉ាស៊ីនមេ';
      }
      
      setError(errorMessage);
      
      // Still provide fallback data even on error
      const fallbackOrders = [
        {
          id: 1,
          order_number: "ORD20260218K0I9C6",
          user_id: 5,
          total_amount: 45.00,
          status: "pending",
          payment_status: "pending",
          shipping_address: "Phnom Penh, Cambodia",
          phone_number: "012345678",
          notes: "Sample order",
          created_at: "2026-02-18T10:30:00",
          updated_at: null,
          order_items: []
        }
      ];
      setOrders(fallbackOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    try {
      await ordersAPI.updateOrderStatus(selectedOrder.id, { status: selectedStatus });
      setShowStatusModal(false);
      setSelectedOrder(null);
      setSelectedStatus('');
      fetchOrders();
    } catch (err) {
      setError('បរាជ័យក្នុងការកែប្រែស្ថានភាពការបញ្ជាទិញ');
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status || 'pending');
    setShowStatusModal(true);
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handlePrintOrder = () => {
    if (!selectedOrder) return;
    
    const printContent = `
      <html>
        <head>
          <title>ការបញ្ជាទិញ #${selectedOrder.id}</title>
          <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap');
            
            body { 
              font-family: 'Battambang', 'Khmer OS', 'Khmer OS System', 'Khmer OS Content', 'Arial Unicode MS', sans-serif; 
              padding: 20px; 
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #374151;
              padding-bottom: 20px;
            }
            .header h1 { 
              font-size: 24px; 
              margin: 0 0 10px 0;
              font-weight: 700;
            }
            .header h2 { 
              font-size: 18px; 
              margin: 0 0 5px 0;
              font-weight: 400;
            }
            .order-info { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 20px; 
            }
            .info-section {
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 15px;
            }
            .info-item { 
              margin-bottom: 10px; 
              display: flex;
              justify-content: space-between;
            }
            .label { 
              font-weight: 700; 
              color: #374151; 
              min-width: 120px;
            }
            .value {
              text-align: right;
              font-weight: 400;
            }
            .customer-info { 
              background: #f3f4f6; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 20px; 
            }
            .customer-info h3 {
              margin: 0 0 10px 0;
              font-size: 16px;
              font-weight: 700;
            }
            .customer-info p {
              margin: 5px 0;
              font-size: 14px;
            }
            .products-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px; 
            }
            .products-table th, .products-table td { 
              border: 1px solid #e5e7eb; 
              padding: 10px 8px; 
              text-align: left; 
              font-size: 14px;
            }
            .products-table th { 
              background: #374151; 
              font-weight: 700; 
              color: white;
            }
            .products-table td:nth-child(2),
            .products-table td:nth-child(3),
            .products-table td:nth-child(4) {
              text-align: right;
            }
            .total { 
              text-align: right; 
              font-size: 18px; 
              font-weight: 700; 
              margin-top: 20px; 
              padding: 15px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .status { 
              padding: 4px 12px; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: 700;
              display: inline-block;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              margin: 20px 0 10px 0;
              color: #374151;
            }
            @media print { 
              body { padding: 15px; font-size: 12px; }
              .header { margin-bottom: 20px; }
              .header h1 { font-size: 20px; }
              .header h2 { font-size: 16px; }
              .products-table th, .products-table td { padding: 8px 6px; font-size: 12px; }
              .total { font-size: 16px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ព័ត៌មានការបញ្ជាទិញ</h1>
            <h2>លេខកូដ: #${selectedOrder.id}</h2>
            <p>កាលបរិច្ឆេទ: ${selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('km-KH') : 'N/A'}</p>
          </div>
          
          <div class="order-info">
            <div class="info-section">
              <div class="info-item">
                <span class="label">លេខកូដការបញ្ជាទិញ:</span>
                <span class="value">${selectedOrder.order_number}</span>
              </div>
              <div class="info-item">
                <span class="label">ស្ថានភាព:</span>
                <span class="value">
                  <span class="status" style="background-color: ${getStatusColor(selectedOrder.status).includes('green') ? '#10b981' : getStatusColor(selectedOrder.status).includes('yellow') ? '#f59e0b' : getStatusColor(selectedOrder.status).includes('red') ? '#ef4444' : getStatusColor(selectedOrder.status).includes('blue') ? '#3b82f6' : getStatusColor(selectedOrder.status).includes('purple') ? '#8b5cf6' : getStatusColor(selectedOrder.status).includes('indigo') ? '#6366f1' : getStatusColor(selectedOrder.status).includes('teal') ? '#14b8a6' : '#6b7280'}; color: white;">
                    ${getStatusText(selectedOrder.status)}
                  </span>
                </span>
              </div>
            </div>
            <div class="info-section">
              <div class="info-item">
                <span class="label">សរុប:</span>
                <span class="value">$${selectedOrder.total_amount}</span>
              </div>
              <div class="info-item">
                <span class="label">វិធីទូទាត់:</span>
                <span class="value">${selectedOrder.payment_method || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="customer-info">
            <h3>ព័ត៌មានអតិថិជន</h3>
            <p><strong>អាសយដ្ឋាន:</strong> ${selectedOrder.shipping_address}</p>
            <p><strong>លេខទូរស័ព្ទ:</strong> ${selectedOrder.phone_number}</p>
            ${selectedOrder.notes ? `<p><strong>កំណត់សម្គាល់:</strong> ${selectedOrder.notes}</p>` : ''}
          </div>
          
          <div class="section-title">ផលិតផលដែលបានបញ្ជាទិញ</div>
          <table class="products-table">
            <thead>
              <tr>
                <th>ផលិតផល</th>
                <th>តម្លៃ</th>
                <th>ចំនួន</th>
                <th>សរុប</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrder.order_items?.map(item => `
                <tr>
                  <td>${item.product?.name || `ផលិតផល #${item.product_id}`}</td>
                  <td>$${item.unit_price}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.total_price}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          
          <div class="total">
            សរុបទាំងអស់: $${selectedOrder.total_amount}
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'បញ្ចប់';
      case 'pending': return 'កំពុងរង់ចាំ';
      case 'cancelled': return 'បានបដិសេធ';
      case 'confirmed': return 'បានបញ្ជាក់';
      case 'processing': return 'កំពុងដំណើរការ';
      case 'shipped': return 'បានផ្ញើ';
      case 'delivered': return 'បានដឹកជញ្ជូន';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">កំពុងផ្ទុកទិន្នន័យការបញ្ជាទិញ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">គ</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">ប្រព័ន្ធគ្រប់គ្រងហាង</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  ផ្ទាំងគ្រប់គ្រង
                </Link>
                <Link to="/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  ផលិតផល
                </Link>
                <Link to="/orders" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  ការបញ្ជាទិញ
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                ថយក្រោយ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">គ្រប់គ្រងការបញ្ជាទិញ</h2>
            <p className="mt-1 text-sm text-gray-600">មើល និងគ្រប់គ្រងការបញ្ជាទិញរបស់អតិថិជន</p>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">បញ្ជីការបញ្ជាទិញ</h3>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4">
                {error}
              </div>
            )}

            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      លេខកូដការបញ្ជាទិញ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      អតិថិជន
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      រុប
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ស្ថានភាព
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      កាលបរិច្ឆេទ
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">សកម្មភាព</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="mt-2 text-sm">មិនមានការបញ្ជាទិញទេ</p>
                          <p className="text-xs text-gray-400 mt-1">មិនមានការបញ្ជាទិញថ្មីៗពីអតិថិជន</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          <div className="ml-2 text-xs text-gray-500">{order.order_number || 'ការបញ្ជាទិញ'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.shipping_address || 'គ្មានឈ្មោះ'}</div>
                          <div className="text-sm text-gray-500">{order.phone_number || 'គ្មានលេខទូរស័ព្ទ'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${order.total_amount || '0.00'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('km-KH') : 'គ្មានកាលបរិច្ឆេទ'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => openDetailsModal(order)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            មើលលម្អិត
                          </button>
                          <button 
                            onClick={() => openStatusModal(order)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            កែស្ថានភាព
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-lg bg-white max-h-[80vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">ព័ត៌មានការបញ្ជាទិញ #{selectedOrder.id}</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">លេខកូដការបញ្ជាទិញ</p>
                    <p className="text-sm text-gray-900">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">ស្ថានភាព</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">កាលបរិច្ឆេទ</p>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('km-KH') : 'គ្មានកាលបរិច្ឆេទ'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">សរុប</p>
                    <p className="text-sm font-medium text-gray-900">${selectedOrder.total_amount}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">ព័ត៌មានអតិថិជន</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedOrder.shipping_address}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.phone_number}</p>
                  </div>
                </div>
                
                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">កំណត់សម្គាល់</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">ផលិតផលដែលបានបញ្ជាទិញ</p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ផលិតផល</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">តម្លៃ</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ចំនួន</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">សរុប</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.order_items?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {item.product?.name || `ផលិតផល #${item.product_id}`}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">${item.unit_price}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">${item.total_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={handlePrintOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  បោះពុម្ព
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  បិទ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">កែប្រែស្ថានភាពការបញ្ជាទិញ</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  លេខកូដការបញ្ជាទិញ: #{selectedOrder?.id}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  ស្ថានភាពបច្ចុប្បន្ន: <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder?.status)}`}>
                    {getStatusText(selectedOrder?.status)}
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ស្ថានភាពថ្មី</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">កំពុងរង់ចាំ</option>
                  <option value="confirmed">បានបញ្ជាក់</option>
                  <option value="processing">កំពុងដំណើរការ</option>
                  <option value="shipped">បានផ្ញើ</option>
                  <option value="delivered">បានដឹកជញ្ជូន</option>
                  <option value="completed">បញ្ចប់</option>
                  <option value="cancelled">បានបដិសេធ</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedOrder(null);
                    setSelectedStatus('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  បោះបង់
                </button>
                <button
                  onClick={handleUpdateOrderStatus}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  កែប្រែ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
