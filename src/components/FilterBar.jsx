import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CityFilter = ({ onClose, selectedCity, onCityChange }) => {
  const cities = [
    'Dubai',
    'All Cities',
    'Abu Dhabi',
    'Ras Al Khaimah',
    'Sharjah',
    'Fujairah',
    'Ajman',
    'Umm Al Quwain',
    'Al Ain'
  ];

  return (
    <Card className="absolute top-full left-0 z-50 min-w-[400px] mt-2 p-4 shadow-lg bg-white rounded-xl">
      <div className="flex flex-wrap gap-2 mb-4">
        {cities.map((city) => (
          <Button
            key={city}
            variant={city === selectedCity ? "default" : "outline"}
            className={`
              rounded-full px-4 py-2 text-sm font-normal
              ${city === selectedCity 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }
            `}
            onClick={() => onCityChange(city)}
          >
            {city}
          </Button>
        ))}
      </div>
      <Button 
        className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-md py-3"
        onClick={onClose}
      >
        Apply Filters
      </Button>
    </Card>
  );
};

const FilterButton = ({ label, value, isOpen, onClick }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="flex flex-col items-start justify-start p-3 h-auto hover:bg-transparent"
  >
    <span className="font-semibold text-gray-900">{value || label}</span>
    <div className="flex items-center gap-1 text-gray-500">
      <span className="text-sm">Select</span>
      <ChevronDown 
        size={16} 
        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </div>
  </Button>
);

export default function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Dubai');

  const handleClose = () => setIsOpen(false);
  const handleToggle = () => setIsOpen(!isOpen);
  
  return (
    <div className="relative inline-block">
      <div className="border border-gray-200 rounded-full">
        <FilterButton
          label="City"
          value={selectedCity}
          isOpen={isOpen}
          onClick={handleToggle}
        />
      </div>
      
      {isOpen && (
        <CityFilter
          selectedCity={selectedCity}
          onCityChange={(city) => {
            setSelectedCity(city);
            // Uncomment the following line if you want to close on selection
            // handleClose();
          }}
          onClose={handleClose}
        />
      )}
    </div>
  );
}