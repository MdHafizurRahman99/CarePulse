"use client"
import React, { useState } from 'react';
import { Pill, Phone, Calendar, User, Hash, Plus, Trash2, Save } from 'lucide-react';
import axios from 'axios';

const MedicationScheduler = () => {
  const [name, setName] = useState('');
  const [tabletSchedules, setTabletSchedules] = useState([{ tablet: '', time: '' }]);
  const [numberField, setNumberField] = useState('');
  const [calendyUrl, setCalendyUrl] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [submittedData, setSubmittedData] = useState([]);

  const handleTabletChange = (index, field, value) => {
    const newSchedules = [...tabletSchedules];
    newSchedules[index][field] = value;
    setTabletSchedules(newSchedules);
  };

  const addTabletSchedule = () => {
    setTabletSchedules([...tabletSchedules, { tablet: '', time: '' }]);
  };

  const removeTabletSchedule = (index) => {
    setTabletSchedules(tabletSchedules.filter((_, i) => i !== index));
  };
const makeReminderCall  = async (patientData) => {
  const url = "https://api.bland.ai/v1/calls";
  const medicationList = patientData.tabletSchedules.map(schedule => `${schedule.tablet} at ${schedule.time}`).join(', ');
  console.log(medicationList)
  const headers = {
    authorization: process.env.AUTHORIZATION_KEY,
    "Content-Type": "application/json",
  };

  const data = {
    phone_number: patientData.numberField,
    task: `You are an advanced AI Call Assistant responsible for handling emergency medical inquiries and appointment bookings. Your job is to ensure a smooth, structured, and professional interaction with the user.

    You will:
    
    - Assist users calling for emergency medical help.
    - Book doctor appointments based on user preference & availability.
    - Check doctor availability using webhooks.
    - Handle different responses if a time slot is unavailable.
    - End the call professionally after confirming the appointment.
    
    Your tone should be calm, polite, and professional.`,
    model: "base",
    language: "en",
    voice: "nat",
    voice_settings: {},
    pathway_id: "5397cf82-3de9-41c8-8c37-6906793a6d6d",
    local_dialing: false,
    max_duration: 12,
    answered_by_enabled: false,
    wait_for_greeting: false,
    noise_cancellation: false,
    record: false,
    amd: false,
    interruption_threshold: 100,
    voicemail_message: null,
    temperature: null,
    transfer_phone_number: null,
    transfer_list: {},
    metadata: null,
    pronunciation_guide: [],
    start_time: null,
    background_track: "none",
      request_data: {
        patient_name: patientData.name,
        medications: medicationList,
      },
    dynamic_data: [],
    analysis_preset: null,
    analysis_schema: {},
    webhook: null,
    calendly: {},
    timezone: "Asia/Karachi",
    reduce_latency: true,
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error sending API request:", error.response ? error.response.data : error.message);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, tabletSchedules, numberField, calendyUrl, emergencyPhone };
    console.log(data)
    try {
      await makeReminderCall(data);
      setSubmittedData([...submittedData, data]);
      
      // Reset form
      setName('');
      setTabletSchedules([{ tablet: '', time: '' }]);
      setNumberField('');
      setCalendyUrl('');
      setEmergencyPhone('');
    } catch (error) {
      alert('Failed to schedule medication reminder. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-black"> 
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 flex items-center justify-center gap-2">
            <Pill className="h-8 w-8 text-blue-600" />
            Medication Scheduler
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 inline mr-2 text-blue-600" />
              Patient Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              <Pill className="h-4 w-4 inline mr-2 text-blue-600" />
              Medications Schedule
            </label>
            {tabletSchedules.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <select
                  value={item.tablet}
                  onChange={(e) => handleTabletChange(index, 'tablet', e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Medication</option>
                  <option value="Panadol">Panadol</option>
                  <option value="Rizek">Rizek</option>
                  <option value="Extor">Extor</option>
                </select>
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) => handleTabletChange(index, 'time', e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
                {tabletSchedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTabletSchedule(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTabletSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Plus className="h-4 w-4" />
              Add Medication
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 inline mr-2 text-blue-600" />
                Phone Number
              </label>
              <input
                  type="tel"
                  placeholder='Number with country code'
                value={numberField}
                onChange={(e) => setNumberField(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-2 text-blue-600" />
                Calendly URL
              </label>
              <input
                type="url"
                value={calendyUrl}
                onChange={(e) => setCalendyUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 inline mr-2 text-blue-600" />
                Emergency Phone
              </label>
              <input
                type="tel"
                placeholder='Number with country code'
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save and Schedule Call
            </button>
          </div>
        </form>
      </div>

      {submittedData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-black">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Scheduled Reminders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Medications</th>
                  <th className="px-4 py-3 text-left">Phone Number</th>
                  <th className="px-4 py-3 text-left">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submittedData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{data.name}</td>
                    <td className="px-4 py-3">
                      {data.tabletSchedules.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-blue-600" />
                          {item.tablet} at {item.time}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3">{data.numberField}</td>
                    <td className="px-4 py-3">{data.emergencyPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationScheduler;