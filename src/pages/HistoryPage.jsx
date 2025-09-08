import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from '../hooks/useHistory'; // Updated import
import { useWardsRealTime } from '../hooks/useWardsRealTime'; // Updated import
import LoadingSpinner from '../components/LoadingSpinner';
import { HiFilter, HiCalendar, HiSearch } from 'react-icons/hi';
import { format } from 'date-fns';
import { HiArrowLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const { history, loading, error, fetchHistory } = useHistory();
    const navigate = useNavigate();
    const { wards } = useWardsRealTime();
    const [filters, setFilters] = useState({
        wardId: '',
        roomId: '',
        startDate: '',
        endDate: ''
    });
    const filterRef = useRef(null);
    const filterButtonRef = useRef(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            wardId: '',
            roomId: '',
            startDate: '',
            endDate: ''
        });
        fetchHistory();
        setShowFilters(false);
    };

    const handleBack = () => {
        navigate('/');
    };
    
    const formatTimestamp = (timestamp) => {
        return format(timestamp, 'MMM dd, yyyy HH:mm:ss');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'occupied': return 'bg-red-100 text-red-800';
            case 'for cleaning': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target) &&
                filterButtonRef.current &&
                !filterButtonRef.current.contains(event.target)
            ) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilters]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100">
            {/* Header */}
            <header className="fixed top-[155px] sm:top-48 w-full z-10  bg-white shadow-sm  ">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex justify-between ">
                        <div>
                            <h1 className=" sm:text-xl font-din font-regular text-dark-gray-70 ">Room Status History</h1>
                            <p className="font-din font-medium text-dark-gray-70  mt-1">Track all room status changes</p>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            ref={filterButtonRef}
                            className="flex items-center mt-1 sm:mt-4 text-sm sm:text-[16px]  sm:mt-0 space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg  bg-yellow-100 hover:bg-yellow-200 font-din font-regular text-dark-gray-70 self-end"
                        >
                            <HiFilter className="w-3 h-3 sm:h-4 sm-w-4" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div ref={filterRef} className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Ward Filter */}
                                <div>
                                    <label className="block text-sm font-din font-regular text-dark-gray-70 mb-2">
                                        Ward
                                    </label>
                                    <select
                                        value={filters.wardId}
                                        onChange={(e) => handleFilterChange('wardId', e.target.value)}
                                        className="w-full p-2 border font-din text-sm font-regular text-dark-gray-70 border-gray-300 rounded-md"
                                    >
                                        <option value="">All Wards</option>
                                        {wards.map(ward => (
                                            <option key={ward.id} value={ward.id}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Room Filter */}
                                <div>
                                    <label className="block text-sm font-din font-regular text-dark-gray-70 mb-2">
                                        Room ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter room ID"
                                        value={filters.roomId}
                                        onChange={(e) => handleFilterChange('roomId', e.target.value)}
                                        className="w-full p-2 border border-gray-300  font-din text-sm font-regular text-dark-gray-70 rounded-md"
                                    />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-din font-regular text-dark-gray-70 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="w-full p-2 border border-gray-300 font-din text-sm font-regular text-dark-gray-70 rounded-md"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-din font-regular text-dark-gray-70 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="w-full p-2 borderfont-din text-sm font-regular text-dark-gray-70  border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-4 space-x-3">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 font-din text-sm font-regular text-dark-gray-70 border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    onClick={() => {
                                        fetchHistory(filters);
                                        setShowFilters(false);
                                    }}
                                    className="px-4 py-0 bg-yellow-200 hover:bg-yellow-300 font-din font-regular text-dark-gray-70 rounded-md "
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="fixed top-[245px] [bottom:55px] sm:[bottom:65px] sm:top-[300px]  left-0 right-0  w-full border-2 border-yellow-100 rounded-xl  flex-grow overflow-auto max-w-8xl mx-auto px-5 sm:px-6 lg:px-8 py-2 sm:py-4 scrollbar-custom">
                {loading ? (
                    <LoadingSpinner message="Loading history..." />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex  flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h2 className=" text-sm font-din font-regular text-dark-gray-70">
                                    {history.length} Status Changes Found
                                </h2>
                                <span className=" text-xs sm:text-sm   font-din font-light text-dark-gray-70">
                                    Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-40 px-6 py-3 text-left text-sm font-din font-bold text-blue-900 uppercase tracking-wider ">
                                            Timestamp
                                        </th>
                                        <th className=" w-48 px-6 py-3 text-left text-sm font-din font-bold text-blue-900 uppercase tracking-wider ">
                                            Ward
                                        </th>
                                        <th className="w-24 px-6 py-3 text-left text-sm font-din font-bold text-blue-900 uppercase tracking-wider ">
                                            Room
                                        </th>
                                        <th className="w-32 px-6 py-3 text-left text-sm font-din font-bold text-blue-900 uppercase tracking-wider ">
                                            Previous Status
                                        </th>
                                        <th className="w-32 px-6 py-3 text-left text-sm font-din font-bold text-blue-900 uppercase tracking-wider ">
                                            New Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {history.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-din font-regular text-dark-gray-70 ">
                                                {formatTimestamp(item.timestamp)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-din font-regular text-dark-gray-70 ">
                                                {item.wardName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-din font-regular text-dark-gray-70 ">
                                                {item.roomId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap ">
                                                <span className={`px-2 py-1 text-sm font-din font-regular rounded-full ${getStatusColor(item.previousStatus)}`}>
                                                    {item.previousStatus.charAt(0).toUpperCase() + item.previousStatus.slice(1).toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-sm font-din font-regular  rounded-full ${getStatusColor(item.newStatus)}`}>
                                                    {item.newStatus.charAt(0).toUpperCase() + item.newStatus.slice(1).toLowerCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {history.length === 0 && (
                            <div className="text-center py-12">
                                <HiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="font-din font-regular text-dark-gray-70">No history records found with current filters</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Back Button - Fixed Bottom Left */}
            <div className=" fixed bottom-2 left-6 ">
                <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 text-sm sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 bg-yellow-100 hover:bg-yellow-200 font-din font-regular text-dark-gray-70 rounded-full shadow-lg transition-all duration-200 font-medium hover:shadow-xl"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    <span>Back to Wards</span>
                </button>
            </div>
        </div>
    );
};

export default HistoryPage;