import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CreditCard,
    DollarSign,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    Receipt,
    Download,
    Eye,
} from "lucide-react";

const fees = [
    {
        id: 1,
        title: "CSE Tuition Fee - Spring 2024",
        description: "Semester tuition fee for Computer Science and Engineering courses",
        amount: 45000,
        dueDate: "2024-02-15",
        status: "pending",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        category: "Tuition",
        semester: "Spring 2024",
        details: "Includes CSE course materials, programming lab access, and software licenses"
    },
    {
        id: 2,
        title: "Computer Lab Equipment Fee",
        description: "Annual fee for CSE computer lab access and equipment maintenance",
        amount: 8000,
        dueDate: "2024-01-30",
        status: "paid",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        category: "Lab Fee",
        semester: "Annual",
        details: "Covers computer lab maintenance, programming software licenses, and hardware upgrades"
    },
    {
        id: 3,
        title: "CSE Student Activity Fee",
        description: "Fee for CSE student clubs, hackathons, and tech events",
        amount: 3000,
        dueDate: "2024-02-28",
        status: "overdue",
        image: "https://images.unsplash.com/photo-1523240794102-9e5fa7c444b1?w=400&h=300&fit=crop",
        category: "Activity",
        semester: "Spring 2024",
        details: "Supports CSE student organizations, coding competitions, and tech workshops"
    },
    {
        id: 4,
        title: "Digital Library & Resources Fee",
        description: "Access to programming databases, e-books, and research materials",
        amount: 2500,
        dueDate: "2024-03-15",
        status: "pending",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        category: "Resource",
        semester: "Spring 2024",
        details: "Includes online programming resources, IEEE papers, and software development tools"
    },
    {
        id: 5,
        title: "Campus Transportation Fee",
        description: "Campus shuttle service and parking facilities for CSE students",
        amount: 1500,
        dueDate: "2024-02-10",
        status: "paid",
        image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
        category: "Transport",
        semester: "Spring 2024",
        details: "Covers campus shuttle service, parking permits, and transportation infrastructure"
    },
    {
        id: 6,
        title: "Health Services Fee",
        description: "Campus health center access and medical services for CSE students",
        amount: 2000,
        dueDate: "2024-03-01",
        status: "pending",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        category: "Health",
        semester: "Spring 2024",
        details: "Provides access to campus health center, counseling services, and emergency care"
    },
    {
        id: 7,
        title: "Programming Contest Fee",
        description: "Registration fee for CSE programming competitions and hackathons",
        amount: 1000,
        dueDate: "2024-02-20",
        status: "pending",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
        category: "Contest",
        semester: "Spring 2024",
        details: "Covers participation in ACM ICPC, hackathons, and coding competitions"
    },
    {
        id: 8,
        title: "Software License Fee",
        description: "Annual fee for programming software and development tools",
        amount: 3500,
        dueDate: "2024-01-25",
        status: "paid",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
        category: "Software",
        semester: "Annual",
        details: "Includes licenses for IDEs, development tools, and cloud computing platforms"
    }
];

const getStatusColor = (status) => {
    switch (status) {
        case "paid":
            return "bg-green-100 text-green-800 border-green-200";
        case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "overdue":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case "paid":
            return <CheckCircle size={16} />;
        case "pending":
            return <Clock size={16} />;
        case "overdue":
            return <AlertCircle size={16} />;
        default:
            return <Clock size={16} />;
    }
};

export default function Finance() {
    const navigate = useNavigate();
    const [selectedFee, setSelectedFee] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = fees.filter(fee => fee.status === "paid").reduce((sum, fee) => sum + fee.amount, 0);
    const pendingFees = fees.filter(fee => fee.status === "pending").reduce((sum, fee) => sum + fee.amount, 0);
    const overdueFees = fees.filter(fee => fee.status === "overdue").reduce((sum, fee) => sum + fee.amount, 0);

    const handlePayNow = (fee) => {
        setSelectedFee(fee);
        setShowPaymentModal(true);
    };

    const handlePayment = () => {
        // Here you would integrate with a payment gateway
        alert(`Processing payment for ${selectedFee.title} - ৳${selectedFee.amount.toLocaleString()}`);
        setShowPaymentModal(false);
        setSelectedFee(null);
    };

    const downloadStatement = (format) => {
        const studentName = "CSE Student"; // This would come from user context
        const studentId = "2021-1-60-123"; // This would come from user context
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (format === 'csv') {
            // Generate CSV content
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Student Name,Student ID,Date\n";
            csvContent += `${studentName},${studentId},${currentDate}\n\n`;
            csvContent += "Fee Title,Category,Amount (BDT),Status,Due Date,Semester\n";

            fees.forEach(fee => {
                csvContent += `"${fee.title}","${fee.category}","৳${fee.amount.toLocaleString()}","${fee.status}","${new Date(fee.dueDate).toLocaleDateString()}","${fee.semester}"\n`;
            });

            csvContent += `\nTotal Fees,৳${totalFees.toLocaleString()}\n`;
            csvContent += `Paid Amount,৳${paidFees.toLocaleString()}\n`;
            csvContent += `Pending Amount,৳${pendingFees.toLocaleString()}\n`;
            csvContent += `Overdue Amount,৳${overdueFees.toLocaleString()}\n`;

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `CSE_Finance_Statement_${currentDate.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (format === 'pdf') {
            // Generate PDF-like content (simulated)
            const pdfContent = `
                CSE FINANCE STATEMENT
                =====================

                Student Name: ${studentName}
                Student ID: ${studentId}
                Date: ${currentDate}

                FEE DETAILS:
                ============
                ${fees.map(fee => `
                ${fee.title}
                Category: ${fee.category}
                Amount: ৳${fee.amount.toLocaleString()}
                Status: ${fee.status.toUpperCase()}
                Due Date: ${new Date(fee.dueDate).toLocaleDateString()}
                Semester: ${fee.semester}
                `).join('\n')}

                SUMMARY:
                ========
                Total Fees: ৳${totalFees.toLocaleString()}
                Paid Amount: ৳${paidFees.toLocaleString()}
                Pending Amount: ৳${pendingFees.toLocaleString()}
                Overdue Amount: ৳${overdueFees.toLocaleString()}

                Generated on: ${currentDate}
            `;

            // Create a text file that simulates PDF content
            const blob = new Blob([pdfContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `CSE_Finance_Statement_${currentDate.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }

        setShowDownloadMenu(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        to="/student-dashboard"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="text-xl font-bold">CSE Finance & Fees</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <Receipt size={16} />
                            Download Statement
                        </button>

                        {showDownloadMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => downloadStatement('csv')}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        Download as CSV
                                    </button>
                                    <button
                                        onClick={() => downloadStatement('pdf')}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        Download as PDF
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <div className="bg-white rounded-xl p-4 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Total Fees</p>
                            <p className="text-2xl font-bold text-slate-900">৳{totalFees.toLocaleString()}</p>
                        </div>
                        <DollarSign className="text-slate-400" size={24} />
                    </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 shadow border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600">Paid</p>
                            <p className="text-2xl font-bold text-green-800">৳{paidFees.toLocaleString()}</p>
                        </div>
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4 shadow border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-800">৳{pendingFees.toLocaleString()}</p>
                        </div>
                        <Clock className="text-yellow-500" size={24} />
                    </div>
                </div>

                <div className="bg-red-50 rounded-xl p-4 shadow border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600">Overdue</p>
                            <p className="text-2xl font-bold text-red-800">৳{overdueFees.toLocaleString()}</p>
                        </div>
                        <AlertCircle className="text-red-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Fees Grid */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fees.map((fee) => (
                        <div key={fee.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            {/* Fee Image */}
                            <div className="relative h-48 bg-slate-200">
                                <img
                                    src={fee.image}
                                    alt={fee.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(fee.status)}`}>
                                        <div className="flex items-center gap-1">
                                            {getStatusIcon(fee.status)}
                                            {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                                        </div>
                                    </span>
                                </div>
                            </div>

                            {/* Fee Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-slate-900 mb-1">{fee.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{fee.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900">৳{fee.amount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-500">{fee.category}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Calendar size={14} />
                                        <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Eye size={14} />
                                        <span>{fee.semester}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePayNow(fee)}
                                        disabled={fee.status === "paid"}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${fee.status === "paid"
                                            ? "bg-green-100 text-green-800 cursor-not-allowed"
                                            : "bg-slate-600 text-white hover:bg-slate-700"
                                            }`}
                                    >
                                        <CreditCard size={16} />
                                        {fee.status === "paid" ? "Paid" : "Pay Now"}
                                    </button>
                                    <button
                                        onClick={() => downloadStatement('csv')}
                                        className="flex items-center justify-center p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Download this fee receipt"
                                    >
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedFee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Payment Details</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-slate-900">{selectedFee.title}</h4>
                                <p className="text-sm text-slate-600 mt-1">{selectedFee.details}</p>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Amount:</span>
                                    <span className="text-xl font-bold text-slate-900">৳{selectedFee.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-slate-600">Due Date:</span>
                                    <span className="text-slate-900">{new Date(selectedFee.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Pay ৳{selectedFee.amount.toLocaleString()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close download menu */}
            {showDownloadMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDownloadMenu(false)}
                />
            )}
        </div>
    );
} 