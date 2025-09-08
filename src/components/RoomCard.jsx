import React, { Fragment } from "react";
import { Listbox } from "@headlessui/react";

// Add validation function here too for redundancy
const validateStatus = (status) => {
  if (!status) return 'available';

  const normalizedStatus = status.toLowerCase().trim();
  const validStatuses = ['available', 'occupied', 'for cleaning'];

  if (validStatuses.includes(normalizedStatus)) {
    return normalizedStatus;
  }

  if (normalizedStatus.includes('avail') || normalizedStatus.includes('avl')) {
    return 'available';
  }
  if (normalizedStatus.includes('occup')) {
    return 'occupied';
  }
  if (normalizedStatus.includes('clean')) {
    return 'for cleaning';
  }

  return 'available';
};

const RoomCard = ({ room, onStatusChange }) => {
  const { id, status = "available" } = room;

  // Validate the status before using it
  const validatedStatus = validateStatus(status);

  const statuses = [
    { value: "available", label: "Available", bgColor: "bg-green-500", textColor: "text-white font-din font-light", icon: "🛏️" },
    { value: "for cleaning", label: "For Cleaning", bgColor: "bg-yellow-300", textColor: "text-yellow-900 font-din font-light", icon: "🧹" },
    { value: "occupied", label: "Occupied", bgColor: "bg-red-500", textColor: "text-white font-din font-light", icon: "👤" },
  ];

  const handleStatusChange = (newStatus) => {
    const timestamp = new Date();
    onStatusChange(id, newStatus, timestamp);
  };
  const selectedStatus = statuses.find((s) => s.value === validatedStatus); // Use validatedStatus

  
  const formatRoomNumber = (roomId) => roomId.toString();

  return (
    <div className="rounded-xl min-w-5xl border-2 border-gray-200 bg-white p-2 justify-between flex-nowrap hover:shadow-lg transition-all duration-300 w-full max-w-md">

      <div className="flex items-center justify-between">
        {/* Left side: Icon + Room */}
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-3xl">{selectedStatus.icon}</span>
          <span className="text-sm sm:text-lg font-din font-Regular text-dark-gray-70">
            Room {formatRoomNumber(id)}
          </span>
        </div>

        {/* Right side: Dropdown */}
        <div className="w-32 ml-auto ">
          <Listbox value={validatedStatus} onChange={handleStatusChange}> {/* Use validatedStatus */}
            <div className="relative">
              <Listbox.Button className={`w-full  py-1 px-1 text-sm sm:text-[16px] sm:py-3 sm:px-3 rounded-lg font-medium focus:outline-none ${selectedStatus.bgColor} ${selectedStatus.textColor}`}>
                {selectedStatus.label}
              </Listbox.Button>

              <Listbox.Options className="absolute mt-1 w-full bg-gradient-to-br from-yellow-50 to-indigo-100 border-2 border-white rounded-xl shadow-lg z-10">
                {statuses.map((s) => (
                  <Listbox.Option key={s.value} value={s.value} as={Fragment}>
                    {({ active }) => (
                      <li
                        className={`cursor-pointer px-3 py-2 font-bold flex items-center mt-2 mb-1 rounded-xl  space-x-2 ${s.bgColor} ${s.textColor} ${active ? "ring-2 ring-blue-500" : ""}`}
                      >
                        <span>{s.label}</span>
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;