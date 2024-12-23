'use client';

import { useEffect, useState } from 'react';
import { Card } from './Card';
import axios from 'axios';

interface MonthlyData {
  month: string;
  averageTemp: number;
  totalRain: number;
  maxTemp: { value: number; date: string };
  minTemp: { value: number; date: string };
  rainiestDay: { value: number; date: string };
}

export function MonthlyInsights() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
      <Card variant="glass" className="p-4 md:p-8 w-full text-center">
        <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-4">Monthly Insights</h2>
        <p className="text-sm md:text-base text-gray-400">
          Coming Soon! Monthly weather statistics and trends.
        </p>
      </Card>
    </div>
  );
}