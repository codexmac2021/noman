import React, { useState, useEffect } from 'react';
import { HiPlus, HiArrowLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useSharePoint } from '../hooks/useSharePoint';
import LoadingSpinner from '../components/LoadingSpinner';

// Available icons for wards
const WARD_ICONS = {
    '🚑': 'Ambulance',
    '🩺': 'Stethoscope',
    '💊': 'Medication',
    '🔬🩸': 'Lab',
    '🧬': 'DNA',
    '🧠': 'Brain',
    '🦴': 'Bone',
    '👁️': 'Eye',
    '🦷': 'Tooth',
    '👂': 'Ear',
    '❤️': 'Heart',
    '🫁': 'Lungs',
    '🧒': 'Pediatrics',
    '👵': 'Geriatrics',
    '🤰': 'Maternity',
    '🧠': 'Neurology',
    '🦵': 'Orthopedics',
    '🧘': 'Rehabilitation'
};

const AddWardRoomPage = () => {
    const navigate = useNavigate();
    const { getListItems, addListItem, loading: spLoading, error: spError } = useSharePoint();
    const [wards, setWards] = useState([]);
    const [newWard, setNewWard] = useState({
        name: '',
        icon: '🚑',
        description: ''
    });
    const [newRoom, setNewRoom] = useState({
        number: '',
        status: 'available',
        wardId: ''
    });
    const [activeTab, setActiveTab] = useState('wards');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Fetch existing wards on component mount
    useEffect(() => {
        fetchWards();
    }, []);

    const fetchWards = async () => {
        try {
            const wardsData = await getListItems('wards');
            setWards(wardsData);

            // Set the first ward as selected if available
            if (wardsData.length > 0 && !newRoom.wardId) {
                setNewRoom(prev => ({ ...prev, wardId: wardsData[0].Id }));
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
            showMessage('Failed to fetch wards', 'error');
        }
    };

    const handleAddWard = async (e) => {
        e.preventDefault();
        if (!newWard.name.trim()) {
            showMessage('Ward name is required', 'error');
            return;
        }

        setLoading(true);
        try {
            // Check if ward already exists
            const existingWard = wards.find(w => w.Title.toLowerCase() === newWard.name.toLowerCase());
            if (existingWard) {
                showMessage('A ward with this name already exists', 'error');
                setLoading(false);
                return;
            }

            // Add the new ward to SharePoint
            await addListItem('wards', {
                Title: newWard.name,
                Icon: newWard.icon,
                Description: newWard.description
            });

            showMessage('Ward added successfully!', 'success');
            setNewWard({ name: '', icon: '🚑', description: '' });
            fetchWards(); // Refresh the wards list
        } catch (error) {
            console.error('Error adding ward:', error);
            showMessage('Failed to add ward', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!newRoom.number.trim() || !newRoom.wardId) {
            showMessage('Room number and ward selection are required', 'error');
            return;
        }

        setLoading(true);
        try {
            const selectedWard = wards.find(w => w.Id === newRoom.wardId);

            // Check if room already exists in this ward
            const existingRooms = await getListItems('rooms', `Title eq '${newRoom.number}' and WardId eq ${newRoom.wardId}`);
            if (existingRooms.length > 0) {
                showMessage('A room with this number already exists in the selected ward', 'error');
                setLoading(false);
                return;
            }

            // Add the new room to SharePoint
            await addListItem('rooms', {
                Title: newRoom.number,
                Status: newRoom.status,
                WardId: newRoom.wardId,
                WardName: selectedWard.Title,
                LastUpdated: new Date().toISOString()
            });

            showMessage('Room added successfully!', 'success');
            setNewRoom({ number: '', status: 'available', wardId: newRoom.wardId });
        } catch (error) {
            console.error('Error adding room:', error);
            showMessage('Failed to add room', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleBack = () => {
        navigate('/');
    };

    if (spLoading) return <LoadingSpinner message="Loading..." />;
    if (spError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-xl font-din font-normal text-red-600 mb-2">Connection Error</h2>
                    <p className="text-gray-600">{spError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 p-4">
            <div className="max-w-8xl mx-auto px-4 sm:px-16 fixed top-[130px] sm:top-[200px] [bottom:52px] sm:[bottom:60px] border-2 border-gray-100 rounded-xl left-0 right-0 w-full pt-6 flex-grow overflow-y-auto scrollbar-custom">

                {/* Header */}
                <div className="flex items-center justify-between mb-2 mt-2 sm:mt-0 sm:mb-6">
                    <h1 className="sm:text-xl font-din font-regular text-dark-gray-70">Add New Wards & Rooms</h1>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`fixed w-full top-[260px] mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-din font-regular text-dark-gray-70 ${activeTab === 'wards' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('wards')}
                    >
                        Manage Wards
                    </button>
                    <button
                        className={`py-2 px-4 font-din font-regular text-dark-gray-70 ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('rooms')}
                    >
                        Manage Rooms
                    </button>
                </div>

                {/* Wards Tab */}
                {activeTab === 'wards' && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        {/* Existing Wards List */}
                        <h2 className="sm:text-lg font-din font-regular text-dark-gray-70 mb-4">Existing Wards</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {wards.map((ward) => (
                                <div
                                    key={ward.Id}
                                    className="p-2 bg-white shadow rounded text-center text-sm font-din font-normal text-dark-gray-70 hover:bg-gray-100 hover:shadow-md transition duration-200 cursor-pointer"
                                >
                                    {ward.Title}
                                </div>
                            ))}
                        </div>

                        <h2 className="sm:text-lg font-din font-regular text-dark-gray-70 mt-6 mb-4">Add New Ward</h2>

                        <form onSubmit={handleAddWard} className="space-y-4">
                            <div>
                                <label className="block text-sm font-din font-medium text-dark-gray-70 mb-1">
                                    Ward Name
                                </label>
                                <input
                                    type="text"
                                    value={newWard.name}
                                    onChange={(e) => setNewWard({ ...newWard, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-sm font-din font-medium text-dark-gray-70 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="E.g., Maternity Ward"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-din font-medium text-dark-gray-70 mb-1">
                                    Ward Icon
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    {Object.entries(WARD_ICONS).map(([icon, name]) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`p-2 text-2xl rounded-lg border-2 ${newWard.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                            onClick={() => setNewWard({ ...newWard, icon })}
                                            title={name}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-din font-medium text-dark-gray-70 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={newWard.description}
                                    onChange={(e) => setNewWard({ ...newWard, description: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Brief description of this ward..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 text-sm sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 bg-yellow-100 hover:bg-yellow-200 font-din font-regular text-dark-gray-70 rounded-full shadow-lg transition-all duration-200 font-medium hover:shadow-xl disabled:opacity-50"
                            >
                                <HiPlus className="w-5 h-5" />
                                <span>{loading ? 'Adding Ward...' : 'Add Ward'}</span>
                            </button>
                        </form>
                    </div>
                )}

                {/* Rooms Tab */}
                {activeTab === 'rooms' && (
                    <div className="bg-white rounded-xl shadow-md p-6 sm:mb-6">
                        <h2 className="sm:text-lg font-din font-regular text-dark-gray-70 mb-4">Add New Room</h2>

                        <form onSubmit={handleAddRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm sm:text-[16px] font-din font-medium text-dark-gray-70 mb-1">
                                    Select Ward
                                </label>
                                <select
                                    value={newRoom.wardId}
                                    onChange={(e) => setNewRoom({ ...newRoom, wardId: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-[16px] font-din font-medium text-dark-gray-70"
                                >
                                    {wards.length === 0 ? (
                                        <option value="">No wards available. Please add a ward first.</option>
                                    ) : (
                                        <>
                                            <option value="">Select a ward</option>
                                            {wards.map(ward => (
                                                <option key={ward.Id} value={ward.Id}>
                                                    {ward.Title}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm sm:text-[16px] font-din font-medium text-dark-gray-70 mb-1">
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    value={newRoom.number}
                                    onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-xs sm:text-[16px] font-din font-medium text-dark-gray-70 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="E.g., 101, A12, ICU-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-[16px] font-din font-medium text-dark-gray-70 mb-1">
                                    Initial Status
                                </label>
                                <select
                                    value={newRoom.status}
                                    onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-xs sm:text-[16px] font-din font-medium text-dark-gray-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="for cleaning">For Cleaning</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !newRoom.wardId}
                                className="flex items-center space-x-2 text-sm sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2 bg-yellow-100 hover:bg-yellow-200 font-din font-regular text-dark-gray-70 rounded-full shadow-lg transition-all duration-200 font-medium hover:shadow-xl disabled:opacity-50"
                            >
                                <HiPlus className="w-5 h-5" />
                                <span>{loading ? 'Adding Room...' : 'Add Room'}</span>
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Back Button - Fixed Bottom Left */}
            <div className="fixed bottom-2 left-6">
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

export default AddWardRoomPage;