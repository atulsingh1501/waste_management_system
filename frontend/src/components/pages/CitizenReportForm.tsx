import React, { useState } from 'react';
import { 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Send,
  CheckCircle
} from 'lucide-react';

export default function CitizenReportForm() {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    priority: 'medium',
    wasteType: 'solid',
    coordinates: { lat: 0, lng: 0 }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        location: '',
        description: '',
        priority: 'medium',
        wasteType: 'solid',
        coordinates: { lat: 0, lng: 0 }
      });
    }, 3000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your report has been received and assigned reference number <strong>#WR-{Date.now().toString().slice(-6)}</strong>
          </p>
          <p className="text-sm text-gray-500">
            You will receive updates on the progress via email. Expected response time: 2-4 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Report a Waste Issue</h2>
          <p className="text-gray-600 text-sm mt-1">
            Help us maintain a clean environment by reporting uncollected waste or other issues.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter street address or landmark"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="absolute right-3 top-3 text-emerald-600 hover:text-emerald-700"
              >
                Use Current Location
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Describe the issue in detail (e.g., 'Bin not collected for 3 days', 'Overflowing garbage on sidewalk')"
            />
          </div>

          {/* Priority & Waste Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="low">Low - Can wait a few days</option>
                <option value="medium">Medium - Should be addressed soon</option>
                <option value="high">High - Urgent attention needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waste Type
              </label>
              <select
                value={formData.wasteType}
                onChange={(e) => setFormData(prev => ({ ...prev, wasteType: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="solid">General Waste</option>
                <option value="recyclable">Recyclables</option>
                <option value="compost">Compost/Organic</option>
              </select>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload a photo to help us understand the issue better
              </p>
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-gray-500">
              * Required fields. Your report will be reviewed within 2-4 hours.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Send className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Emergency Contact */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-orange-800">Emergency Situations</h3>
            <p className="text-sm text-orange-700 mt-1">
              For urgent health or safety hazards, call our emergency hotline at <strong>311</strong> immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}