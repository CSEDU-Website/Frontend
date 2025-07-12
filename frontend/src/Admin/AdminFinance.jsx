import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  DollarSign,
  Calendar,
  Users,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  Clock,
  Check,
  Banknote,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function AdminFinance() {
  const [financeEvents, setFinanceEvents] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [paidPayments, setPaidPayments] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Tab management
  const [activeTab, setActiveTab] = useState('events') // events, payments
  
  // Modal states
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [showViewEventModal, setShowViewEventModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Form state for create event
  const [eventFormData, setEventFormData] = useState({
    title: '',
    amount: '',
    batch: '',
    deadline: ''
  })

  // Batch options (assuming CSE batches)
  const batchOptions = Array.from({ length: 11 }, (_, i) => `CSE-${45 + i}`)

  // Fetch all finance data
  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      
      // Fetch finance events
      const eventsResponse = await axios.get(`${BACKEND_URL}/v1/finance/events`)
      setFinanceEvents(eventsResponse.data)
      setFilteredEvents(eventsResponse.data)
      
      // Fetch pending payments
      const pendingResponse = await axios.get(`${BACKEND_URL}/v1/finance/payments/pending`)
      setPendingPayments(pendingResponse.data)
      
      // Fetch paid payments
      const paidResponse = await axios.get(`${BACKEND_URL}/v1/finance/payments/paid`)
      setPaidPayments(paidResponse.data)
      
      // Combine payments for filtering
      const allPayments = [...pendingResponse.data, ...paidResponse.data]
      setFilteredPayments(allPayments)
      
      setError('')
    } catch (err) {
      setError('Failed to fetch finance data')
      console.error('Error fetching finance data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinanceData()
  }, [])

  // Filter events based on search term and batch
  useEffect(() => {
    let filtered = financeEvents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.batch.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Batch filter
    if (batchFilter) {
      filtered = filtered.filter(event => event.batch === batchFilter)
    }

    setFilteredEvents(filtered)
  }, [financeEvents, searchTerm, batchFilter])

  // Filter payments based on search term and status
  useEffect(() => {
    const allPayments = [...pendingPayments, ...paidPayments]
    let filtered = allPayments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }, [pendingPayments, paidPayments, searchTerm, statusFilter])

  // Handle form input changes
  const handleEventInputChange = (e) => {
    const { name, value } = e.target
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Reset form
  const resetEventForm = () => {
    setEventFormData({
      title: '',
      amount: '',
      batch: '',
      deadline: ''
    })
  }

  // Create finance event
  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Prepare data with proper format
      const eventData = {
        ...eventFormData,
        amount: parseInt(eventFormData.amount),
        deadline: new Date(eventFormData.deadline).toISOString()
      }

      await axios.post(`${BACKEND_URL}/v1/finance/events`, eventData)
      setSuccess('Finance event created successfully!')
      setShowCreateEventModal(false)
      resetEventForm()
      fetchFinanceData()
    } catch (err) {
      setError('Failed to create finance event')
      console.error('Error creating finance event:', err)
    } finally {
      setLoading(false)
    }
  }

  // Verify payment
  const handleVerifyPayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to verify this payment?')) {
      try {
        setLoading(true)
        await axios.post(`${BACKEND_URL}/v1/finance/payments/verify/${paymentId}`)
        setSuccess('Payment verified successfully!')
        fetchFinanceData()
      } catch (err) {
        setError('Failed to verify payment')
        console.error('Error verifying payment:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  // Open modals
  const openViewEventModal = (event) => {
    setSelectedEvent(event)
    setShowViewEventModal(true)
  }

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleString()
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount)
  }

  // Check if deadline is approaching (within 7 days)
  const isDeadlineApproaching = (deadline) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffDays = (deadlineDate - now) / (1000 * 60 * 60 * 24)
    return diffDays <= 7 && diffDays > 0
  }

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalRevenue = paidPayments.reduce((sum, payment) => {
    const event = financeEvents.find(e => e.id === payment.event_id)
    return sum + (event ? event.amount : 0)
  }, 0)

  const pendingRevenue = pendingPayments.reduce((sum, payment) => {
    const event = financeEvents.find(e => e.id === payment.event_id)
    return sum + (event ? event.amount : 0)
  }, 0)

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-600 mt-1">Manage finance events and student payments</p>
        </div>
        <button
          onClick={() => setShowCreateEventModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Finance Event
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{financeEvents.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Revenue</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{formatCurrency(pendingRevenue)}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingPayments.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <CreditCard size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Finance Events
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Student Payments
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'events' ? "Search events..." : "Search payments..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {activeTab === 'events' ? (
              /* Batch Filter for Events */
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Batches</option>
                {batchOptions.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            ) : (
              /* Status Filter for Payments */
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            )}

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('')
                setBatchFilter('')
                setStatusFilter('all')
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <>
              {/* Finance Events Tab */}
              {activeTab === 'events' && (
                <div>
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Finance Events Found</h3>
                      <p className="text-gray-600 mb-4">
                        {financeEvents.length === 0 
                          ? "Get started by creating your first finance event." 
                          : "Try adjusting your filters to see more events."}
                      </p>
                      <button
                        onClick={() => setShowCreateEventModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Create Finance Event
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredEvents.map((event) => {
                        const approaching = isDeadlineApproaching(event.deadline)
                        
                        return (
                          <div key={event.id} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${approaching ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-green-600">
                                    <DollarSign size={16} />
                                    <span className="font-semibold">{formatCurrency(event.amount)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-blue-600">
                                    <Users size={16} />
                                    <span>{event.batch}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} />
                                    <span>Deadline: {formatDate(event.deadline)}</span>
                                  </div>
                                </div>
                                {approaching && (
                                  <div className="mt-3 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium inline-block">
                                    Deadline Approaching
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => openViewEventModal(event)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div>
                  {filteredPayments.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
                      <p className="text-gray-600">No student payments match your current filters.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPayments.map((payment) => {
                        const event = financeEvents.find(e => e.id === payment.event_id)
                        
                        return (
                          <div key={payment.id} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {event ? event.title : 'Unknown Event'}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(payment.status)}`}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FileText size={16} />
                                    <span>Transaction ID: {payment.transaction_id}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign size={16} />
                                    <span>Amount: {event ? formatCurrency(event.amount) : 'N/A'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Submitted: {formatDate(payment.submitted_at)}</span>
                                  </div>
                                  {payment.verified_at && (
                                    <div className="flex items-center gap-2">
                                      <Check size={16} />
                                      <span>Verified: {formatDate(payment.verified_at)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => openPaymentModal(payment)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                                {payment.status === 'pending' && (
                                  <button
                                    onClick={() => handleVerifyPayment(payment.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Verify Payment"
                                  >
                                    <Check size={18} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Finance Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Finance Event</h2>
                <button
                  onClick={() => setShowCreateEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventFormData.title}
                    onChange={handleEventInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (BDT) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={eventFormData.amount}
                      onChange={handleEventInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Batch *
                    </label>
                    <select
                      name="batch"
                      value={eventFormData.batch}
                      onChange={handleEventInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Batch</option>
                      {batchOptions.map(batch => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={eventFormData.deadline}
                    onChange={handleEventInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateEventModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {showViewEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Finance Event Details</h2>
                <button
                  onClick={() => setShowViewEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h3>
                  {isDeadlineApproaching(selectedEvent.deadline) && (
                    <div className="mb-4 px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-medium">
                      ⚠️ Payment deadline is approaching
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Amount</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedEvent.amount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Target Batch</p>
                      <p className="text-gray-600">{selectedEvent.batch}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Payment Deadline</p>
                      <p className="text-gray-600">{formatDate(selectedEvent.deadline)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Created At</p>
                      <p className="text-gray-600">{formatDate(selectedEvent.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowViewEventModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {financeEvents.find(e => e.id === selectedPayment.event_id)?.title || 'Unknown Event'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Transaction ID</p>
                      <p className="text-gray-600 font-mono">{selectedPayment.transaction_id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Amount</p>
                      <p className="text-gray-600">
                        {financeEvents.find(e => e.id === selectedPayment.event_id)?.amount 
                          ? formatCurrency(financeEvents.find(e => e.id === selectedPayment.event_id).amount)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Submitted At</p>
                      <p className="text-gray-600">{formatDate(selectedPayment.submitted_at)}</p>
                    </div>
                  </div>
                  
                  {selectedPayment.verified_at && (
                    <div className="flex items-center gap-3">
                      <Check size={20} className="text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Verified At</p>
                        <p className="text-gray-600">{formatDate(selectedPayment.verified_at)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  {selectedPayment.status === 'pending' && (
                    <button
                      onClick={() => {
                        setShowPaymentModal(false)
                        handleVerifyPayment(selectedPayment.id)
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Verify Payment
                    </button>
                  )}
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminFinance