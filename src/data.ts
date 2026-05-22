export type OrganType = 'HEART' | 'KIDNEY' | 'LIVER' | 'LUNG';

export interface Hospital {
  id: string;
  name: string;
  distance: number; // in miles
  travelTime: number; // in minutes
  address: string;
  phone: string;
  status: 'ACTIVE' | 'ALERT'; // ACTIVE (Green), ALERT (Emergency Red/Alert Yellow)
  statusText: string; // e.g. "Active Transplant Unit Available" or "ICU Beds: Call to Verify"
  capabilities: OrganType[];
  equipment: string[];
}

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Metro General Medical Center',
    distance: 2.4,
    travelTime: 6,
    address: '1400 Medical Center Parkway, Sector 4',
    phone: '+1-800-555-0191',
    status: 'ACTIVE',
    statusText: 'Active Transplant Unit Available',
    capabilities: ['HEART', 'KIDNEY'],
    equipment: [
      '24/7 Emergency Dialysis',
      'ECMO (Extracorporeal Membrane Oxygenation) Machine',
      'Left Ventricular Assist Device (LVAD) Support Team',
      'On-Call Thoracic Transplant Surgeon',
      'Continuous Renal Replacement Therapy (CRRT)'
    ]
  },
  {
    id: 'hosp-2',
    name: 'St. Jude Transplant & Research Hospital',
    distance: 4.8,
    travelTime: 12,
    address: '800 Research Way, Biotech Campus',
    phone: '+1-800-555-0192',
    status: 'ACTIVE',
    statusText: 'Active Transplant Unit Available',
    capabilities: ['HEART', 'KIDNEY', 'LIVER', 'LUNG'],
    equipment: [
      'Dedicated Cardiopulmonary Bypass Systems',
      '24/7 Renal Replacement Therapy (CRRT)',
      'On-site Organ Recovery Coordinator',
      'Dual-Surgeon Emergency Transplant Teams',
      'In-house Histocompatibility Lab',
      'Live-Donor Liver Transplant Specialists',
      'Inhaled Nitric Oxide (iNO) Therapy System'
    ]
  },
  {
    id: 'hosp-3',
    name: 'Mercy Civic Hospital & Trauma Unit',
    distance: 6.1,
    travelTime: 15,
    address: '210 Civic Boulevard, Downtown Area',
    phone: '+1-800-555-0193',
    status: 'ALERT',
    statusText: 'ICU Beds: Call to Verify Capacity',
    capabilities: ['KIDNEY'],
    equipment: [
      '24/7 Emergency Hemodialysis',
      'Nephrology Intensive Care Unit (NICU) Beds',
      'Emergency Vascular Access Assembly Team',
      'Peritoneal Dialysis Support Services'
    ]
  },
  {
    id: 'hosp-4',
    name: 'University Pulmonary & Liver Care Center',
    distance: 8.3,
    travelTime: 19,
    address: '3200 University Drive, Medical Plaza C',
    phone: '+1-800-555-0194',
    status: 'ACTIVE',
    statusText: 'Active Transplant Unit Available',
    capabilities: ['LIVER', 'LUNG'],
    equipment: [
      'Double Lung Transplant Surgical Team',
      'High-Frequency Oscillatory Ventilation (HFOV)',
      'Advanced Liver Support (Molecular Adsorbent Recirculating System - MARS)',
      '24/7 ECMO Mobilization Unit',
      'Hepatobiliary Critical Care Specialists'
    ]
  },
  {
    id: 'hosp-5',
    name: 'County Emergency Trauma & Organ Center',
    distance: 11.2,
    travelTime: 25,
    address: '500 Trauma Plaza, East Ridge Road',
    phone: '+1-800-555-0195',
    status: 'ALERT',
    statusText: 'ICU Beds: Call to Verify Capacity',
    capabilities: ['HEART', 'LUNG'],
    equipment: [
      '24/7 Extracorporeal Life Support (ECLS)',
      'Dedicated Cardiothoracic Intensive Care Beds',
      'Mobile ECMO Retrieval Retrieval Squad',
      'Advanced Mechanical Circulatory Support (AMCS)'
    ]
  },
  {
    id: 'hosp-6',
    name: 'Presbyterian Renal & Hepatic Center',
    distance: 14.5,
    travelTime: 33,
    address: '1980 Highland Avenue, North Heights',
    phone: '+1-800-555-0196',
    status: 'ACTIVE',
    statusText: 'Active Transplant Unit Available',
    capabilities: ['KIDNEY', 'LIVER'],
    equipment: [
      'Continuous Venovenous Hemofiltration (CVVH)',
      'Emergency Portal Vein Thrombosis Intervention Unit',
      '24/7 Hepatobiliary Emergency Surgical Suite',
      'Acute Liver Failure Medical Protocol Team'
    ]
  }
];
