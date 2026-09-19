const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../../data/db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

class DbStore {
  constructor() {
    this.data = {
      users: [],
      incidents: [],
      responders: [],
      resources: [],
      notifications: [],
      timeline: []
    };
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to load DB file, initializing clean state', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save DB file', err);
    }
  }

  seedInitialData() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);

    // Initial Users
    this.data.users = [
      {
        id: 'usr-citizen-1',
        name: 'Alex Rivera',
        email: 'citizen@resqflow.org',
        phone: '+1 (555) 234-5678',
        passwordHash: defaultPasswordHash,
        role: 'Citizen',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-responder-1',
        name: 'Capt. Marcus Vance',
        email: 'responder@resqflow.org',
        phone: '+1 (555) 876-5432',
        passwordHash: defaultPasswordHash,
        role: 'Responder',
        responderType: 'Ambulance',
        organization: 'Metro EMS Unit 4',
        serviceArea: 'Downtown & Campus District',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-admin-1',
        name: 'Commander Sarah Jenkins',
        email: 'admin@resqflow.org',
        phone: '+1 (555) 999-0000',
        passwordHash: defaultPasswordHash,
        role: 'Admin',
        organization: 'City Emergency Operations Center',
        createdAt: new Date().toISOString()
      }
    ];

    // Initial Responders
    this.data.responders = [
      {
        id: 'resp-1',
        userId: 'usr-responder-1',
        name: 'Metro EMS Unit 4 (Ambulance)',
        type: 'Ambulance',
        organization: 'Metro EMS',
        latitude: 12.9716,
        longitude: 77.5946,
        availability: 'Available',
        currentWorkload: 1,
        contact: '+1 (555) 876-5432',
        serviceArea: 'Downtown'
      },
      {
        id: 'resp-2',
        userId: null,
        name: 'Central Fire Rescue Engine 2',
        type: 'Fire & Rescue',
        organization: 'City Fire Dept',
        latitude: 12.9780,
        longitude: 77.5990,
        availability: 'Available',
        currentWorkload: 0,
        contact: '+1 (555) 123-4567',
        serviceArea: 'Central'
      },
      {
        id: 'resp-3',
        userId: null,
        name: 'Precinct 5 Traffic Squad',
        type: 'Police',
        organization: 'Metro Police Dept',
        latitude: 12.9650,
        longitude: 77.5900,
        availability: 'Available',
        currentWorkload: 2,
        contact: '+1 (555) 321-7654',
        serviceArea: 'South District'
      },
      {
        id: 'resp-4',
        userId: null,
        name: 'City General Trauma Response',
        type: 'Hospital',
        organization: 'City General Hospital',
        latitude: 12.9800,
        longitude: 77.6050,
        availability: 'Available',
        currentWorkload: 3,
        contact: '+1 (555) 999-1111',
        serviceArea: 'Metro Wide'
      },
      {
        id: 'resp-5',
        userId: null,
        name: 'Disaster Rapid Response Team Alpha',
        type: 'Disaster-response',
        organization: 'National Guard Emergency Division',
        latitude: 12.9550,
        longitude: 77.6100,
        availability: 'Available',
        currentWorkload: 0,
        contact: '+1 (555) 444-2222',
        serviceArea: 'Regional'
      }
    ];

    // Initial Emergency Resources Database
    this.data.resources = [
      {
        id: 'res-1',
        name: 'City General Hospital ICU & Trauma',
        type: 'Hospital',
        organization: 'Health Services Dept',
        latitude: 12.9800,
        longitude: 77.6050,
        availability: 'Available',
        capacity: '4 ICU Beds, 12 ER Bays',
        contact: '+1 (555) 999-1111'
      },
      {
        id: 'res-2',
        name: 'Metro Rapid Ambulance Unit 12',
        type: 'Ambulance',
        organization: 'Metro EMS',
        latitude: 12.9716,
        longitude: 77.5946,
        availability: 'Available',
        capacity: 'Advanced Life Support (ALS)',
        contact: '+1 (555) 876-5432'
      },
      {
        id: 'res-3',
        name: 'Central Fire Station No. 1',
        type: 'Fire Station',
        organization: 'City Fire Department',
        latitude: 12.9780,
        longitude: 77.5990,
        availability: 'Available',
        capacity: '3 Ladder Trucks, Hazmat Crew',
        contact: '+1 (555) 123-4567'
      },
      {
        id: 'res-4',
        name: 'Downtown Police Headquarters',
        type: 'Police Station',
        organization: 'Metro Police Dept',
        latitude: 12.9650,
        longitude: 77.5900,
        availability: 'Available',
        capacity: '15 Units Patrol Ready',
        contact: '+1 (555) 321-7654'
      },
      {
        id: 'res-5',
        name: 'Red Cross Disaster Relief Operations Center',
        type: 'Shelter',
        organization: 'Red Cross',
        latitude: 12.9550,
        longitude: 77.6100,
        availability: 'Available',
        capacity: '300 Occupants, Food & Medical',
        contact: '+1 (555) 444-2222'
      },
      {
        id: 'res-6',
        name: 'St. Jude Emergency Medical Center',
        type: 'Hospital',
        organization: 'St. Jude Health',
        latitude: 12.9600,
        longitude: 77.5800,
        availability: 'Available',
        capacity: '8 ER Bays',
        contact: '+1 (555) 777-3333'
      }
    ];

    // Seed Initial Realistic Incidents for Hackathon Showcase
    this.data.incidents = [
      {
        id: 'inc-101',
        incidentId: 'RSQ-2026-0001',
        reportedBy: {
          id: 'usr-citizen-1',
          name: 'Alex Rivera',
          email: 'citizen@resqflow.org',
          phone: '+1 (555) 234-5678'
        },
        type: 'Road Accident',
        description: 'Two vehicles collided near the main university campus gate. Severe damage to front hoods, two people injured, one victim appears unconscious.',
        location: {
          address: 'College Main Gate, 5th Avenue',
          landmark: 'Opposite Student Union Center',
          latitude: 12.9724,
          longitude: 77.5951
        },
        severity: 'CRITICAL',
        priorityScore: 92,
        aiSummary: 'A multi-vehicle collision near the college main gate. 2 injured individuals reported, 1 unconscious. Hazardous road blockage reported.',
        peopleAffected: 2,
        injuries: ['Possible severe head trauma', 'Unconscious victim', 'Lacerations'],
        hazards: ['Road obstruction', 'Leaking fuel risk'],
        requiredResources: ['Ambulance', 'Medical Team', 'Police / Traffic Control'],
        status: 'ACCEPTED',
        assignedResponder: {
          id: 'resp-1',
          name: 'Metro EMS Unit 4 (Ambulance)',
          type: 'Ambulance',
          contact: '+1 (555) 876-5432'
        },
        aiRecommendedActions: [
          'Dispatch Advanced Life Support (ALS) Ambulance immediately',
          'Reroute traffic around 5th Avenue College Gate',
          'Alert Trauma Center at City General Hospital'
        ],
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'inc-102',
        incidentId: 'RSQ-2026-0002',
        reportedBy: {
          id: 'usr-citizen-demo-2',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+1 (555) 444-5555'
        },
        type: 'Fire',
        description: 'Dense smoke and visible flames erupting from the 2nd floor window of a commercial building. Smoke spreading to nearby shops.',
        location: {
          address: '42 Commercial Street, Block B',
          landmark: 'Above Metro Electronics',
          latitude: 12.9785,
          longitude: 77.5998
        },
        severity: 'CRITICAL',
        priorityScore: 88,
        aiSummary: 'Structure fire reported on 2nd floor of commercial building. High risk of spreading to neighboring commercial shops. People potentially trapped.',
        peopleAffected: 5,
        injuries: ['Smoke inhalation risk', 'Possible burns'],
        hazards: ['Active flames', 'Toxic electrical smoke', 'Structural compromise'],
        requiredResources: ['Fire Engine', 'Rescue Squad', 'Ambulance', 'Police'],
        status: 'EN ROUTE',
        assignedResponder: {
          id: 'resp-2',
          name: 'Central Fire Rescue Engine 2',
          type: 'Fire & Rescue',
          contact: '+1 (555) 123-4567'
        },
        aiRecommendedActions: [
          'Dispatch 2 Ladder Trucks and Hazmat team',
          'Evacuate commercial block B immediately',
          'Establish 200m safety perimeter'
        ],
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: 'inc-103',
        incidentId: 'RSQ-2026-0003',
        reportedBy: {
          id: 'usr-citizen-demo-3',
          name: 'Robert Chen',
          email: 'robert@example.com',
          phone: '+1 (555) 333-2222'
        },
        type: 'Medical Emergency',
        description: 'Elderly gentleman collapsed in the central park walking zone, complaining of severe chest pain and difficulty breathing.',
        location: {
          address: 'Central City Park, East Pavilion',
          landmark: 'Near Rose Garden Entrance',
          latitude: 12.9680,
          longitude: 77.5890
        },
        severity: 'HIGH',
        priorityScore: 74,
        aiSummary: 'Acute cardiac distress reported in public park. Patient experiencing severe chest tightness and shortness of breath.',
        peopleAffected: 1,
        injuries: ['Suspected myocardial infarction (Heart Attack)'],
        hazards: ['Pedestrian crowd gathering'],
        requiredResources: ['Ambulance', 'Paramedic Team'],
        status: 'ON SCENE',
        assignedResponder: {
          id: 'resp-4',
          name: 'City General Trauma Response',
          type: 'Hospital',
          contact: '+1 (555) 999-1111'
        },
        aiRecommendedActions: [
          'Dispatch paramedic squad equipped with Automated External Defibrillator (AED)',
          'Clear park walkway for rapid ambulance access'
        ],
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 'inc-104',
        incidentId: 'RSQ-2026-0004',
        reportedBy: {
          id: 'usr-citizen-demo-4',
          name: 'Sarah Connor',
          email: 'sarah@example.com',
          phone: '+1 (555) 777-8888'
        },
        type: 'Natural Disaster',
        description: 'Flash flooding on River Road following heavy downpour. Water levels reaching knee height, blocking low-lying residential entry points.',
        location: {
          address: '108 Riverbank Road, Sector 3',
          landmark: 'Near Old River Bridge',
          latitude: 12.9550,
          longitude: 77.6110
        },
        severity: 'MEDIUM',
        priorityScore: 48,
        aiSummary: 'Localized flash flood restricting road access in low-lying area. Multiple households requesting sandbags and drainage support.',
        peopleAffected: 12,
        injuries: ['None reported'],
        hazards: ['Waterlogging', 'Submerged debris', 'Open drain hazard'],
        requiredResources: ['Disaster Response Team', 'Pumping Equipment', 'Shelter'],
        status: 'REPORTED',
        assignedResponder: null,
        aiRecommendedActions: [
          'Deploy municipal water pumps to Sector 3',
          'Issue localized flood warning to nearby residents'
        ],
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      },
      {
        id: 'inc-105',
        incidentId: 'RSQ-2026-0005',
        reportedBy: {
          id: 'usr-citizen-1',
          name: 'Alex Rivera',
          email: 'citizen@resqflow.org',
          phone: '+1 (555) 234-5678'
        },
        type: 'Road Accident',
        description: 'Minor fender bender between two cars. No major injuries, minor bumper damage.',
        location: {
          address: '12 Outer Ring Road',
          landmark: 'Near City Mall Metro Station',
          latitude: 12.9610,
          longitude: 77.5850
        },
        severity: 'LOW',
        priorityScore: 22,
        aiSummary: 'Minor vehicle collision without injuries. Traffic slowing down.',
        peopleAffected: 2,
        injuries: ['None'],
        hazards: ['Minor traffic delay'],
        requiredResources: ['Traffic Police'],
        status: 'RESOLVED',
        assignedResponder: {
          id: 'resp-3',
          name: 'Precinct 5 Traffic Squad',
          type: 'Police',
          contact: '+1 (555) 321-7654'
        },
        aiRecommendedActions: [
          'Move vehicles to shoulder and file standard report'
        ],
        createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];

    // Seed Timelines
    this.data.timeline = [
      {
        id: 'tl-1',
        incidentId: 'RSQ-2026-0001',
        status: 'REPORTED',
        message: 'Emergency report received via voice description.',
        updatedBy: 'Citizen Alex Rivera',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: 'tl-2',
        incidentId: 'RSQ-2026-0001',
        status: 'VERIFIED',
        message: 'AI Processing completed. Severity score assigned: 92/100 (CRITICAL).',
        updatedBy: 'ResQFlow AI Engine',
        timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString()
      },
      {
        id: 'tl-3',
        incidentId: 'RSQ-2026-0001',
        status: 'ASSIGNED',
        message: 'Matched and assigned to Metro EMS Unit 4 (Ambulance).',
        updatedBy: 'Admin Commander Sarah Jenkins',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      },
      {
        id: 'tl-4',
        incidentId: 'RSQ-2026-0001',
        status: 'ACCEPTED',
        message: 'Responder accepted emergency dispatch.',
        updatedBy: 'Capt. Marcus Vance',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ];

    // Initial Notifications
    this.data.notifications = [
      {
        id: 'notif-1',
        userId: 'usr-citizen-1',
        incidentId: 'RSQ-2026-0001',
        title: 'Responder Assigned',
        message: 'Metro EMS Unit 4 has accepted your emergency report and is preparing for dispatch.',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'notif-2',
        userId: 'usr-responder-1',
        incidentId: 'RSQ-2026-0001',
        title: '🚨 New Critical Incident Assigned',
        message: 'You have been assigned to Road Accident RSQ-2026-0001 near College Main Gate.',
        type: 'alert',
        read: false,
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      },
      {
        id: 'notif-3',
        userId: 'usr-admin-1',
        incidentId: 'RSQ-2026-0002',
        title: '⚠️ Critical Fire Incident Alert',
        message: 'Building Fire RSQ-2026-0002 priority 88/100 reported at Commercial Street.',
        type: 'alert',
        read: true,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ];

    this.save();
  }
}

const storeInstance = new DbStore();
module.exports = storeInstance;
