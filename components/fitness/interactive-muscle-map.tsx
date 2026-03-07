'use client';

import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

interface MuscleGroup {
  id: string;
  name: string;
  exercises: string[];
  description: string;
  paths: string[];
  fiberLines?: string[];
}

// ── FRONT MUSCLES ──────────────────────────────────────────────────────────────
const frontMuscles: MuscleGroup[] = [
  {
    id: 'front-neck',
    name: 'Neck (Sternocleidomastoid)',
    description: 'The sternocleidomastoid muscles run along each side of the neck, controlling head rotation and flexion.',
    exercises: ['Neck Curls', 'Neck Extensions', 'Plate Neck Flexion', 'Band Neck Work'],
    paths: [
      'M 93,68 Q 91,72 90,78 Q 92,82 95,84 L 97,78 Q 96,72 95,68 Z',
      'M 107,68 Q 109,72 110,78 Q 108,82 105,84 L 103,78 Q 104,72 105,68 Z',
    ],
  },
  {
    id: 'front-traps',
    name: 'Trapezius',
    description: 'The trapezius extends from the neck to the mid-back and helps move, rotate, and stabilise the shoulder blades.',
    exercises: ['Barbell Shrugs', 'Face Pulls', 'Upright Rows', 'Farmer\'s Walks'],
    paths: [
      // Left trap - sloping from neck to shoulder
      'M 93,80 Q 89,78 84,82 Q 80,86 77,92 L 80,96 Q 83,92 88,88 Q 92,85 95,84 Z',
      // Right trap
      'M 107,80 Q 111,78 116,82 Q 120,86 123,92 L 120,96 Q 117,92 112,88 Q 108,85 105,84 Z',
    ],
    fiberLines: [
      'M 90,82 Q 85,86 80,92',
      'M 110,82 Q 115,86 120,92',
    ],
  },
  {
    id: 'front-deltoids-l',
    name: 'Deltoids (Left)',
    description: 'The anterior deltoid is responsible for shoulder flexion and internal rotation. Well-developed front delts give width to your frame.',
    exercises: ['Overhead Press', 'Front Raises', 'Arnold Press', 'Lateral Raises'],
    paths: [
      'M 77,92 Q 72,96 69,104 Q 68,110 69,116 Q 71,120 74,120 L 78,112 Q 80,104 80,98 Q 80,94 78,92 Z',
    ],
    fiberLines: [
      'M 76,96 Q 73,104 72,112',
      'M 78,94 Q 76,102 74,110',
    ],
  },
  {
    id: 'front-deltoids-r',
    name: 'Deltoids (Right)',
    description: 'The anterior deltoid is responsible for shoulder flexion and internal rotation. Well-developed front delts give width to your frame.',
    exercises: ['Overhead Press', 'Front Raises', 'Arnold Press', 'Lateral Raises'],
    paths: [
      'M 123,92 Q 128,96 131,104 Q 132,110 131,116 Q 129,120 126,120 L 122,112 Q 120,104 120,98 Q 120,94 122,92 Z',
    ],
    fiberLines: [
      'M 124,96 Q 127,104 128,112',
      'M 122,94 Q 124,102 126,110',
    ],
  },
  {
    id: 'front-pecs-l',
    name: 'Pectorals (Left)',
    description: 'The pectoral muscles are the large chest muscles responsible for pushing movements and arm adduction.',
    exercises: ['Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Dips'],
    paths: [
      'M 80,96 Q 86,92 98,92 L 98,100 Q 98,110 96,116 Q 92,120 86,118 Q 80,114 78,108 Q 78,102 80,96 Z',
    ],
    fiberLines: [
      'M 84,96 Q 82,104 82,112',
      'M 88,94 Q 86,102 86,114',
      'M 92,93 Q 90,102 90,116',
      'M 96,93 Q 94,100 94,116',
    ],
  },
  {
    id: 'front-pecs-r',
    name: 'Pectorals (Right)',
    description: 'The pectoral muscles are the large chest muscles responsible for pushing movements and arm adduction.',
    exercises: ['Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Dips'],
    paths: [
      'M 120,96 Q 114,92 102,92 L 102,100 Q 102,110 104,116 Q 108,120 114,118 Q 120,114 122,108 Q 122,102 120,96 Z',
    ],
    fiberLines: [
      'M 116,96 Q 118,104 118,112',
      'M 112,94 Q 114,102 114,114',
      'M 108,93 Q 110,102 110,116',
      'M 104,93 Q 106,100 106,116',
    ],
  },
  {
    id: 'front-biceps-l',
    name: 'Biceps (Left)',
    description: 'The biceps brachii flexes the elbow and supinates the forearm. It\'s one of the most visible upper arm muscles.',
    exercises: ['Barbell Curls', 'Hammer Curls', 'Incline Dumbbell Curls', 'Preacher Curls'],
    paths: [
      'M 70,120 Q 67,128 65,138 Q 65,146 67,150 Q 69,152 72,150 Q 74,146 76,136 Q 76,128 75,122 Q 74,120 72,120 Z',
    ],
    fiberLines: [
      'M 71,124 Q 69,134 69,146',
      'M 73,122 Q 72,132 71,148',
    ],
  },
  {
    id: 'front-biceps-r',
    name: 'Biceps (Right)',
    description: 'The biceps brachii flexes the elbow and supinates the forearm. It\'s one of the most visible upper arm muscles.',
    exercises: ['Barbell Curls', 'Hammer Curls', 'Incline Dumbbell Curls', 'Preacher Curls'],
    paths: [
      'M 130,120 Q 133,128 135,138 Q 135,146 133,150 Q 131,152 128,150 Q 126,146 124,136 Q 124,128 125,122 Q 126,120 128,120 Z',
    ],
    fiberLines: [
      'M 129,124 Q 131,134 131,146',
      'M 127,122 Q 128,132 129,148',
    ],
  },
  {
    id: 'front-forearms-l',
    name: 'Forearms (Left)',
    description: 'The forearm muscles control wrist and finger movements, and are essential for grip strength.',
    exercises: ['Wrist Curls', 'Reverse Curls', 'Dead Hangs', 'Farmer\'s Walks'],
    paths: [
      // Brachioradialis
      'M 66,152 Q 63,162 60,174 Q 58,184 58,190 Q 60,194 63,192 Q 66,186 68,176 Q 70,166 70,156 Q 70,153 68,152 Z',
      // Flexors
      'M 68,154 Q 66,164 64,176 Q 63,186 62,192 Q 60,194 58,192 Q 57,186 58,176 Q 59,166 62,154 Z',
    ],
    fiberLines: [
      'M 65,156 Q 62,170 60,186',
      'M 68,154 Q 66,168 64,184',
    ],
  },
  {
    id: 'front-forearms-r',
    name: 'Forearms (Right)',
    description: 'The forearm muscles control wrist and finger movements, and are essential for grip strength.',
    exercises: ['Wrist Curls', 'Reverse Curls', 'Dead Hangs', 'Farmer\'s Walks'],
    paths: [
      'M 134,152 Q 137,162 140,174 Q 142,184 142,190 Q 140,194 137,192 Q 134,186 132,176 Q 130,166 130,156 Q 130,153 132,152 Z',
      'M 132,154 Q 134,164 136,176 Q 137,186 138,192 Q 140,194 142,192 Q 143,186 142,176 Q 141,166 138,154 Z',
    ],
    fiberLines: [
      'M 135,156 Q 138,170 140,186',
      'M 132,154 Q 134,168 136,184',
    ],
  },
  {
    id: 'front-serratus-l',
    name: 'Serratus Anterior (Left)',
    description: 'The serratus anterior wraps around the rib cage and stabilizes the scapula during pushing movements.',
    exercises: ['Push-Up Plus', 'Scapular Push-Ups', 'Overhead Press', 'Dumbbell Pullovers'],
    paths: [
      'M 80,114 Q 82,118 84,122 L 86,126 Q 84,128 82,126 Q 80,122 79,118 Z',
      'M 80,120 Q 82,124 84,128 L 86,132 Q 84,134 82,132 Q 80,128 79,124 Z',
    ],
  },
  {
    id: 'front-serratus-r',
    name: 'Serratus Anterior (Right)',
    description: 'The serratus anterior wraps around the rib cage and stabilizes the scapula during pushing movements.',
    exercises: ['Push-Up Plus', 'Scapular Push-Ups', 'Overhead Press', 'Dumbbell Pullovers'],
    paths: [
      'M 120,114 Q 118,118 116,122 L 114,126 Q 116,128 118,126 Q 120,122 121,118 Z',
      'M 120,120 Q 118,124 116,128 L 114,132 Q 116,134 118,132 Q 120,128 121,124 Z',
    ],
  },
  {
    id: 'front-abs',
    name: 'Abdominals',
    description: 'The rectus abdominis and transverse abdominis provide core stability, trunk flexion, and protect internal organs.',
    exercises: ['Hanging Leg Raises', 'Cable Crunches', 'Ab Wheel Rollouts', 'Planks'],
    paths: [
      // Individual ab blocks for anatomical look - Upper row
      'M 93,120 Q 92,124 92,130 L 98,130 L 98,120 Q 96,118 93,120 Z',
      'M 107,120 Q 108,124 108,130 L 102,130 L 102,120 Q 104,118 107,120 Z',
      // Middle upper
      'M 92,132 L 92,144 L 98,144 L 98,132 Z',
      'M 108,132 L 108,144 L 102,144 L 102,132 Z',
      // Middle lower
      'M 92,146 L 92,158 L 98,158 L 98,146 Z',
      'M 108,146 L 108,158 L 102,158 L 102,146 Z',
      // Lower abs
      'M 92,160 Q 92,168 94,176 Q 96,180 98,180 L 98,160 Z',
      'M 108,160 Q 108,168 106,176 Q 104,180 102,180 L 102,160 Z',
    ],
  },
  {
    id: 'front-obliques-l',
    name: 'Obliques (Left)',
    description: 'The obliques are responsible for torso rotation and lateral flexion. They help define the waistline.',
    exercises: ['Cable Woodchops', 'Russian Twists', 'Side Planks', 'Pallof Press'],
    paths: [
      'M 82,118 L 86,122 Q 86,128 86,134 L 82,134 Q 80,128 80,122 Z',
      'M 82,136 L 86,136 Q 86,146 86,154 L 82,156 Q 80,148 80,140 Z',
      'M 82,158 L 86,158 Q 86,166 88,174 L 84,176 Q 82,168 82,162 Z',
    ],
  },
  {
    id: 'front-obliques-r',
    name: 'Obliques (Right)',
    description: 'The obliques are responsible for torso rotation and lateral flexion. They help define the waistline.',
    exercises: ['Cable Woodchops', 'Russian Twists', 'Side Planks', 'Pallof Press'],
    paths: [
      'M 118,118 L 114,122 Q 114,128 114,134 L 118,134 Q 120,128 120,122 Z',
      'M 118,136 L 114,136 Q 114,146 114,154 L 118,156 Q 120,148 120,140 Z',
      'M 118,158 L 114,158 Q 114,166 112,174 L 116,176 Q 118,168 118,162 Z',
    ],
  },
  {
    id: 'front-quads-l',
    name: 'Quadriceps (Left)',
    description: 'The quadriceps are the large four-headed muscle group on the front of the thigh, essential for knee extension.',
    exercises: ['Barbell Squats', 'Leg Press', 'Lunges', 'Leg Extensions'],
    paths: [
      // Rectus femoris (center)
      'M 90,194 Q 88,220 88,250 Q 88,268 90,280 Q 92,284 94,280 Q 96,268 96,250 Q 96,220 94,194 Z',
      // Vastus lateralis (outer)
      'M 86,192 Q 82,210 80,240 Q 80,260 82,278 Q 84,282 86,280 Q 88,270 88,250 Q 88,220 88,194 Z',
      // Vastus medialis (inner teardrop)
      'M 96,220 Q 96,250 96,270 Q 94,280 92,284 Q 96,288 98,284 Q 100,276 100,260 Q 100,240 98,220 Z',
    ],
    fiberLines: [
      'M 88,200 Q 86,230 86,260',
      'M 92,196 Q 90,230 90,270',
      'M 96,220 Q 96,250 96,276',
    ],
  },
  {
    id: 'front-quads-r',
    name: 'Quadriceps (Right)',
    description: 'The quadriceps are the large four-headed muscle group on the front of the thigh, essential for knee extension.',
    exercises: ['Barbell Squats', 'Leg Press', 'Lunges', 'Leg Extensions'],
    paths: [
      // Rectus femoris
      'M 110,194 Q 112,220 112,250 Q 112,268 110,280 Q 108,284 106,280 Q 104,268 104,250 Q 104,220 106,194 Z',
      // Vastus lateralis
      'M 114,192 Q 118,210 120,240 Q 120,260 118,278 Q 116,282 114,280 Q 112,270 112,250 Q 112,220 112,194 Z',
      // Vastus medialis
      'M 104,220 Q 104,250 104,270 Q 106,280 108,284 Q 104,288 102,284 Q 100,276 100,260 Q 100,240 102,220 Z',
    ],
    fiberLines: [
      'M 112,200 Q 114,230 114,260',
      'M 108,196 Q 110,230 110,270',
      'M 104,220 Q 104,250 104,276',
    ],
  },
  {
    id: 'front-adductors',
    name: 'Adductors (Inner Thigh)',
    description: 'The adductor muscles pull the legs together and stabilise the hips during movement.',
    exercises: ['Sumo Squats', 'Cable Adductions', 'Copenhagen Planks', 'Adductor Machine'],
    paths: [
      'M 94,188 Q 96,200 98,218 L 100,218 L 102,218 Q 104,200 106,188 Q 104,184 100,182 Q 96,184 94,188 Z',
    ],
  },
  {
    id: 'front-tibialis-l',
    name: 'Tibialis Anterior (Left)',
    description: 'The tibialis anterior runs along the shin and is responsible for dorsiflexion of the foot.',
    exercises: ['Tibialis Raises', 'Toe Walks', 'Ankle Dorsiflexion', 'Sled Drags (Backward)'],
    paths: [
      'M 86,294 Q 84,310 82,332 Q 82,350 84,364 Q 86,368 88,366 Q 90,356 92,336 Q 92,316 90,296 Q 90,294 88,292 Z',
    ],
    fiberLines: [
      'M 87,298 Q 85,324 85,354',
      'M 89,296 Q 88,320 87,360',
    ],
  },
  {
    id: 'front-tibialis-r',
    name: 'Tibialis Anterior (Right)',
    description: 'The tibialis anterior runs along the shin and is responsible for dorsiflexion of the foot.',
    exercises: ['Tibialis Raises', 'Toe Walks', 'Ankle Dorsiflexion', 'Sled Drags (Backward)'],
    paths: [
      'M 114,294 Q 116,310 118,332 Q 118,350 116,364 Q 114,368 112,366 Q 110,356 108,336 Q 108,316 110,296 Q 110,294 112,292 Z',
    ],
    fiberLines: [
      'M 113,298 Q 115,324 115,354',
      'M 111,296 Q 112,320 113,360',
    ],
  },
];

// ── BACK MUSCLES ───────────────────────────────────────────────────────────────
const backMuscles: MuscleGroup[] = [
  {
    id: 'back-traps',
    name: 'Trapezius',
    description: 'The trapezius is a large triangular muscle spanning from the neck to the mid-back, crucial for posture and scapular movement.',
    exercises: ['Barbell Shrugs', 'Face Pulls', 'Rack Pulls', 'Farmer\'s Walks'],
    paths: [
      // Upper traps
      'M 93,80 Q 88,78 82,84 Q 78,90 76,96 L 80,100 Q 84,94 90,88 Q 94,84 96,82 Z',
      'M 107,80 Q 112,78 118,84 Q 122,90 124,96 L 120,100 Q 116,94 110,88 Q 106,84 104,82 Z',
      // Mid/lower traps (diamond shape)
      'M 92,90 Q 96,88 100,86 Q 104,88 108,90 L 110,102 Q 108,114 100,120 Q 92,114 90,102 Z',
    ],
    fiberLines: [
      'M 88,82 Q 82,90 80,98',
      'M 112,82 Q 118,90 120,98',
      'M 96,90 Q 94,104 96,116',
      'M 104,90 Q 106,104 104,116',
    ],
  },
  {
    id: 'back-rear-delts-l',
    name: 'Rear Deltoids (Left)',
    description: 'The posterior deltoid is responsible for shoulder extension and external rotation. Often underdeveloped, it\'s critical for balanced shoulders.',
    exercises: ['Reverse Flyes', 'Face Pulls', 'Bent-Over Dumbbell Raises', 'Cable Rear Delt Flyes'],
    paths: [
      'M 76,94 Q 72,98 70,106 Q 69,112 70,118 Q 72,122 74,120 L 78,112 Q 80,104 80,98 Q 80,95 78,94 Z',
    ],
    fiberLines: [
      'M 76,98 Q 73,106 72,114',
    ],
  },
  {
    id: 'back-rear-delts-r',
    name: 'Rear Deltoids (Right)',
    description: 'The posterior deltoid is responsible for shoulder extension and external rotation. Often underdeveloped, it\'s critical for balanced shoulders.',
    exercises: ['Reverse Flyes', 'Face Pulls', 'Bent-Over Dumbbell Raises', 'Cable Rear Delt Flyes'],
    paths: [
      'M 124,94 Q 128,98 130,106 Q 131,112 130,118 Q 128,122 126,120 L 122,112 Q 120,104 120,98 Q 120,95 122,94 Z',
    ],
    fiberLines: [
      'M 124,98 Q 127,106 128,114',
    ],
  },
  {
    id: 'back-infraspinatus-l',
    name: 'Infraspinatus (Left)',
    description: 'The infraspinatus is a rotator cuff muscle covering much of the scapula, essential for external rotation of the shoulder.',
    exercises: ['External Rotations', 'Face Pulls', 'Band Pull-Aparts', 'Prone Y-Raises'],
    paths: [
      'M 82,98 Q 80,104 80,112 Q 82,118 86,120 Q 90,118 92,112 Q 92,106 90,100 Z',
    ],
  },
  {
    id: 'back-infraspinatus-r',
    name: 'Infraspinatus (Right)',
    description: 'The infraspinatus is a rotator cuff muscle covering much of the scapula, essential for external rotation of the shoulder.',
    exercises: ['External Rotations', 'Face Pulls', 'Band Pull-Aparts', 'Prone Y-Raises'],
    paths: [
      'M 118,98 Q 120,104 120,112 Q 118,118 114,120 Q 110,118 108,112 Q 108,106 110,100 Z',
    ],
  },
  {
    id: 'back-teres-l',
    name: 'Teres Major (Left)',
    description: 'The teres major assists the lats in pulling the arm downward and inward. It is key for back width.',
    exercises: ['Straight-Arm Pulldowns', 'Pull-Ups', 'Dumbbell Rows', 'Cable Rows'],
    paths: [
      'M 80,116 Q 78,120 76,124 Q 78,128 80,126 Q 82,122 84,118 Z',
    ],
  },
  {
    id: 'back-teres-r',
    name: 'Teres Major (Right)',
    description: 'The teres major assists the lats in pulling the arm downward and inward. It is key for back width.',
    exercises: ['Straight-Arm Pulldowns', 'Pull-Ups', 'Dumbbell Rows', 'Cable Rows'],
    paths: [
      'M 120,116 Q 122,120 124,124 Q 122,128 120,126 Q 118,122 116,118 Z',
    ],
  },
  {
    id: 'back-lats',
    name: 'Latissimus Dorsi',
    description: 'The lats are the broadest muscles of the back, responsible for pulling movements and creating the V-taper physique.',
    exercises: ['Pull-Ups', 'Barbell Rows', 'Lat Pulldowns', 'Seated Cable Rows'],
    paths: [
      // Left lat
      'M 80,120 Q 76,132 76,148 Q 78,164 82,174 Q 86,180 90,178 Q 92,172 92,160 Q 92,144 90,128 Q 90,122 88,118 Z',
      // Right lat
      'M 120,120 Q 124,132 124,148 Q 122,164 118,174 Q 114,180 110,178 Q 108,172 108,160 Q 108,144 110,128 Q 110,122 112,118 Z',
    ],
    fiberLines: [
      'M 82,124 Q 80,140 80,160',
      'M 86,122 Q 84,142 84,168',
      'M 90,120 Q 88,144 88,174',
      'M 118,124 Q 120,140 120,160',
      'M 114,122 Q 116,142 116,168',
      'M 110,120 Q 112,144 112,174',
    ],
  },
  {
    id: 'back-triceps-l',
    name: 'Triceps (Left)',
    description: 'The triceps brachii makes up two-thirds of the upper arm. It\'s responsible for elbow extension.',
    exercises: ['Close-Grip Bench Press', 'Tricep Dips', 'Skull Crushers', 'Cable Pushdowns'],
    paths: [
      // Long head
      'M 72,120 Q 68,130 66,140 Q 66,148 68,152 L 70,152 Q 72,148 74,140 Q 76,132 76,124 Z',
      // Lateral head
      'M 70,120 Q 66,126 64,134 Q 64,140 66,146 L 68,146 Q 68,140 70,132 Q 72,126 72,122 Z',
    ],
    fiberLines: [
      'M 71,124 Q 69,136 68,148',
      'M 68,124 Q 66,134 66,142',
    ],
  },
  {
    id: 'back-triceps-r',
    name: 'Triceps (Right)',
    description: 'The triceps brachii makes up two-thirds of the upper arm. It\'s responsible for elbow extension.',
    exercises: ['Close-Grip Bench Press', 'Tricep Dips', 'Skull Crushers', 'Cable Pushdowns'],
    paths: [
      'M 128,120 Q 132,130 134,140 Q 134,148 132,152 L 130,152 Q 128,148 126,140 Q 124,132 124,124 Z',
      'M 130,120 Q 134,126 136,134 Q 136,140 134,146 L 132,146 Q 132,140 130,132 Q 128,126 128,122 Z',
    ],
    fiberLines: [
      'M 129,124 Q 131,136 132,148',
      'M 132,124 Q 134,134 134,142',
    ],
  },
  {
    id: 'back-forearms-l',
    name: 'Forearms (Left)',
    description: 'The posterior forearm muscles control wrist extension and are important for grip strength and arm aesthetics.',
    exercises: ['Reverse Wrist Curls', 'Reverse Curls', 'Towel Hangs', 'Farmer\'s Walks'],
    paths: [
      'M 66,154 Q 63,164 60,176 Q 58,186 58,192 Q 60,196 63,194 Q 66,188 68,178 Q 70,168 70,158 Q 70,155 68,154 Z',
      'M 64,156 Q 62,166 60,178 Q 58,188 58,194 Q 56,196 54,194 Q 54,186 56,176 Q 58,166 62,156 Z',
    ],
  },
  {
    id: 'back-forearms-r',
    name: 'Forearms (Right)',
    description: 'The posterior forearm muscles control wrist extension and are important for grip strength and arm aesthetics.',
    exercises: ['Reverse Wrist Curls', 'Reverse Curls', 'Towel Hangs', 'Farmer\'s Walks'],
    paths: [
      'M 134,154 Q 137,164 140,176 Q 142,186 142,192 Q 140,196 137,194 Q 134,188 132,178 Q 130,168 130,158 Q 130,155 132,154 Z',
      'M 136,156 Q 138,166 140,178 Q 142,188 142,194 Q 144,196 146,194 Q 146,186 144,176 Q 142,166 138,156 Z',
    ],
  },
  {
    id: 'back-erector',
    name: 'Erector Spinae (Lower Back)',
    description: 'The erector spinae muscles run along the spine and are critical for maintaining posture and spinal extension.',
    exercises: ['Deadlifts', 'Back Extensions', 'Good Mornings', 'Romanian Deadlifts'],
    paths: [
      // Left erector column
      'M 94,122 Q 92,140 92,160 Q 92,172 94,180 Q 96,184 98,182 Q 98,170 98,150 Q 98,132 96,122 Z',
      // Right erector column
      'M 106,122 Q 108,140 108,160 Q 108,172 106,180 Q 104,184 102,182 Q 102,170 102,150 Q 102,132 104,122 Z',
    ],
    fiberLines: [
      'M 95,126 Q 94,150 95,178',
      'M 105,126 Q 106,150 105,178',
    ],
  },
  {
    id: 'back-glutes',
    name: 'Glutes',
    description: 'The gluteal muscles are the largest muscle group in the body. They are essential for hip extension, power, and posture.',
    exercises: ['Hip Thrusts', 'Bulgarian Split Squats', 'Romanian Deadlifts', 'Glute Bridges'],
    paths: [
      // Left glute - rounded
      'M 84,180 Q 80,188 80,198 Q 82,208 88,212 Q 94,214 98,210 L 98,186 Q 92,182 84,180 Z',
      // Right glute
      'M 116,180 Q 120,188 120,198 Q 118,208 112,212 Q 106,214 102,210 L 102,186 Q 108,182 116,180 Z',
    ],
    fiberLines: [
      'M 86,186 Q 84,196 88,208',
      'M 92,184 Q 90,196 92,210',
      'M 114,186 Q 116,196 112,208',
      'M 108,184 Q 110,196 108,210',
    ],
  },
  {
    id: 'back-hamstrings-l',
    name: 'Hamstrings (Left)',
    description: 'The hamstrings are three muscles on the back of the thigh responsible for knee flexion and hip extension.',
    exercises: ['Romanian Deadlifts', 'Leg Curls', 'Nordic Curls', 'Glute-Ham Raises'],
    paths: [
      // Biceps femoris (outer)
      'M 84,214 Q 82,232 80,254 Q 80,270 82,282 Q 84,286 86,284 Q 88,276 90,258 Q 90,236 88,214 Z',
      // Semimembranosus/tendinosus (inner)
      'M 90,214 Q 92,232 94,254 Q 94,270 92,282 Q 90,286 88,284 Q 88,274 88,256 Q 88,236 88,216 Z',
    ],
    fiberLines: [
      'M 85,218 Q 83,244 83,276',
      'M 89,216 Q 90,244 91,276',
    ],
  },
  {
    id: 'back-hamstrings-r',
    name: 'Hamstrings (Right)',
    description: 'The hamstrings are three muscles on the back of the thigh responsible for knee flexion and hip extension.',
    exercises: ['Romanian Deadlifts', 'Leg Curls', 'Nordic Curls', 'Glute-Ham Raises'],
    paths: [
      'M 116,214 Q 118,232 120,254 Q 120,270 118,282 Q 116,286 114,284 Q 112,276 110,258 Q 110,236 112,214 Z',
      'M 110,214 Q 108,232 106,254 Q 106,270 108,282 Q 110,286 112,284 Q 112,274 112,256 Q 112,236 112,216 Z',
    ],
    fiberLines: [
      'M 115,218 Q 117,244 117,276',
      'M 111,216 Q 110,244 109,276',
    ],
  },
  {
    id: 'back-calves-l',
    name: 'Calves (Left)',
    description: 'The gastrocnemius and soleus form the calf muscles, responsible for plantarflexion and explosive lower body movements.',
    exercises: ['Standing Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises', 'Jump Rope'],
    paths: [
      // Gastrocnemius medial head
      'M 86,292 Q 84,306 82,324 Q 82,342 84,356 Q 86,362 88,358 Q 88,342 88,324 Q 88,308 88,294 Z',
      // Gastrocnemius lateral head
      'M 88,292 Q 90,306 92,324 Q 92,342 90,358 Q 88,364 86,360 Q 86,344 86,326 Q 86,308 86,294 Z',
    ],
    fiberLines: [
      'M 85,298 Q 84,326 85,352',
      'M 89,298 Q 90,326 89,354',
    ],
  },
  {
    id: 'back-calves-r',
    name: 'Calves (Right)',
    description: 'The gastrocnemius and soleus form the calf muscles, responsible for plantarflexion and explosive lower body movements.',
    exercises: ['Standing Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises', 'Jump Rope'],
    paths: [
      'M 114,292 Q 116,306 118,324 Q 118,342 116,356 Q 114,362 112,358 Q 112,342 112,324 Q 112,308 112,294 Z',
      'M 112,292 Q 110,306 108,324 Q 108,342 110,358 Q 112,364 114,360 Q 114,344 114,326 Q 114,308 114,294 Z',
    ],
    fiberLines: [
      'M 115,298 Q 116,326 115,352',
      'M 111,298 Q 110,326 111,354',
    ],
  },
];

// ── BODY OUTLINE PATHS ─────────────────────────────────────────────────────────
// Head with more anatomical detail
const headPath = 'M 93,42 Q 90,32 92,24 Q 96,18 100,16 Q 104,18 108,24 Q 110,32 107,42 Q 108,48 108,54 Q 106,60 104,64 Q 102,66 100,67 Q 98,66 96,64 Q 94,60 92,54 Q 92,48 93,42 Z';
// Ears
const earPathL = 'M 92,36 Q 89,38 89,44 Q 90,48 92,46';
const earPathR = 'M 108,36 Q 111,38 111,44 Q 110,48 108,46';
// Neck with anatomical shape
const neckPath = 'M 95,66 Q 94,72 93,78 Q 95,82 100,84 Q 105,82 107,78 Q 106,72 105,66 Z';
// Hands with fingers
const handPathL = 'M 56,194 Q 54,198 52,202 Q 50,206 48,210 Q 46,212 48,214 Q 50,212 52,208 Q 53,210 51,214 Q 49,216 50,218 Q 52,216 54,212 Q 55,214 53,218 Q 52,220 54,220 Q 56,218 58,212 Q 59,214 58,218 Q 58,220 60,218 Q 62,214 62,208 Q 62,202 60,196 Z';
const handPathR = 'M 144,194 Q 146,198 148,202 Q 150,206 152,210 Q 154,212 152,214 Q 150,212 148,208 Q 147,210 149,214 Q 151,216 150,218 Q 148,216 146,212 Q 145,214 147,218 Q 148,220 146,220 Q 144,218 142,212 Q 141,214 142,218 Q 142,220 140,218 Q 138,214 138,208 Q 138,202 140,196 Z';
// Feet with toes
const footPathL = 'M 80,370 Q 78,376 76,382 Q 74,388 72,390 Q 74,394 80,396 Q 86,396 90,394 Q 92,390 92,384 Q 92,378 90,372 Z';
const footPathR = 'M 120,370 Q 122,376 124,382 Q 126,388 128,390 Q 126,394 120,396 Q 114,396 110,394 Q 108,390 108,384 Q 108,378 110,372 Z';
// Knee (front)
const kneePathL = 'M 86,282 Q 84,286 84,290 Q 86,296 90,296 Q 94,296 94,290 Q 94,286 92,282 Z';
const kneePathR = 'M 114,282 Q 116,286 116,290 Q 114,296 110,296 Q 106,296 106,290 Q 106,286 108,282 Z';
// Clavicles
const claviclePathL = 'M 96,86 Q 90,88 82,92';
const claviclePathR = 'M 104,86 Q 110,88 118,92';

// ── COMPONENT ──────────────────────────────────────────────────────────────────
export default function InteractiveMuscleMap() {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  const muscles = view === 'front' ? frontMuscles : backMuscles;

  const getMuscleGradientId = (muscleId: string, state: 'default' | 'hover' | 'selected') => {
    return `grad-${muscleId}-${state}`;
  };

  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-gradient-to-b from-[#0d0d0d] to-[#080808] p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Interactive Muscle Map</h2>
          <p className="text-xs text-[#555] mt-0.5">Click a muscle group to explore</p>
        </div>
        {/* Front / Back toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setView('front'); setSelectedMuscle(null); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              view === 'front'
                ? 'bg-gradient-to-b from-[#8b1a1a] to-[#5c0e0e] text-white shadow-[0_0_20px_rgba(139,26,26,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]'
                : 'bg-[#141414] text-[#666] hover:bg-[#1a1a1a] hover:text-[#999] border border-[#1a1a1a]'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => { setView('back'); setSelectedMuscle(null); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              view === 'back'
                ? 'bg-gradient-to-b from-[#8b1a1a] to-[#5c0e0e] text-white shadow-[0_0_20px_rgba(139,26,26,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]'
                : 'bg-[#141414] text-[#666] hover:bg-[#1a1a1a] hover:text-[#999] border border-[#1a1a1a]'
            }`}
          >
            Back
          </button>
          <button
            onClick={() => { setView(v => v === 'front' ? 'back' : 'front'); setSelectedMuscle(null); }}
            className="ml-1 p-1.5 rounded-lg bg-[#141414] text-[#555] hover:bg-[#1a1a1a] hover:text-[#999] transition-all border border-[#1a1a1a]"
            title="Rotate view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* SVG Body */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative w-full max-w-[360px]">
            <svg
              viewBox="30 6 140 406"
              className="w-full h-auto"
              style={{ maxHeight: '560px' }}
            >
              <defs>
                {/* Body skin gradient */}
                <radialGradient id="body-skin" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#1e1616" />
                  <stop offset="70%" stopColor="#151010" />
                  <stop offset="100%" stopColor="#0e0a0a" />
                </radialGradient>

                {/* Muscle gradients for each state */}
                {muscles.map((muscle) => (
                  <React.Fragment key={`grads-${muscle.id}`}>
                    {/* Default state */}
                    <radialGradient id={getMuscleGradientId(muscle.id, 'default')} cx="40%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#4a1818" />
                      <stop offset="50%" stopColor="#321010" />
                      <stop offset="100%" stopColor="#1e0808" />
                    </radialGradient>
                    {/* Hover state */}
                    <radialGradient id={getMuscleGradientId(muscle.id, 'hover')} cx="40%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#7a2020" />
                      <stop offset="50%" stopColor="#5c1414" />
                      <stop offset="100%" stopColor="#3a0c0c" />
                    </radialGradient>
                    {/* Selected state */}
                    <radialGradient id={getMuscleGradientId(muscle.id, 'selected')} cx="40%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#b82e2e" />
                      <stop offset="40%" stopColor="#8b1a1a" />
                      <stop offset="100%" stopColor="#5c0e0e" />
                    </radialGradient>
                  </React.Fragment>
                ))}

                {/* Glow filter for selected muscles */}
                <filter id="muscle-glow-selected" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.4  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="muscle-glow-hover" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.3  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Subtle inner shadow for body parts */}
                <filter id="inner-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feComponentTransfer in="SourceAlpha">
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>
                  <feGaussianBlur stdDeviation="1" />
                  <feOffset dx="0.5" dy="0.5" result="offsetblur" />
                  <feFlood floodColor="#000" floodOpacity="0.5" result="color" />
                  <feComposite in2="offsetblur" operator="in" />
                  <feComposite in2="SourceAlpha" operator="in" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode />
                  </feMerge>
                </filter>

                {/* Ambient occlusion / body shadow */}
                <filter id="body-shadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="shadow" />
                  <feOffset dx="0" dy="2" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Highlight shine */}
                <linearGradient id="body-highlight" x1="0" y1="0" x2="0.3" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>

              {/* Subtle background vignette circle */}
              <circle cx="100" cy="200" r="120" fill="url(#body-skin)" opacity="0.15" />

              {/* ── Body outline parts (non-interactive) ── */}
              <g filter="url(#body-shadow)">
                {/* Head */}
                <path d={headPath} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.5" filter="url(#inner-shadow)" />
                {/* Ears */}
                <path d={earPathL} fill="none" stroke="#2a1a1a" strokeWidth="0.4" />
                <path d={earPathR} fill="none" stroke="#2a1a1a" strokeWidth="0.4" />
                {/* Eyes (subtle) */}
                <ellipse cx="96" cy="38" rx="2.5" ry="1.2" fill="none" stroke="#2a1a1a" strokeWidth="0.3" />
                <ellipse cx="104" cy="38" rx="2.5" ry="1.2" fill="none" stroke="#2a1a1a" strokeWidth="0.3" />
                {/* Nose hint */}
                <path d="M 99,42 Q 100,46 101,42" fill="none" stroke="#2a1a1a" strokeWidth="0.3" />
                {/* Mouth hint */}
                <path d="M 97,50 Q 100,52 103,50" fill="none" stroke="#2a1a1a" strokeWidth="0.25" />
                {/* Neck */}
                <path d={neckPath} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.4" />
                {/* Clavicles */}
                <path d={claviclePathL} fill="none" stroke="#2a1818" strokeWidth="0.5" strokeLinecap="round" />
                <path d={claviclePathR} fill="none" stroke="#2a1818" strokeWidth="0.5" strokeLinecap="round" />
                {/* Hands */}
                <path d={handPathL} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.35" strokeLinejoin="round" />
                <path d={handPathR} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.35" strokeLinejoin="round" />
                {/* Feet */}
                <path d={footPathL} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.4" />
                <path d={footPathR} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.4" />
                {/* Knee caps */}
                <path d={kneePathL} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.4" />
                <path d={kneePathR} fill="url(#body-skin)" stroke="#2a1a1a" strokeWidth="0.4" />
              </g>

              {/* ── Muscle groups ── */}
              {muscles.map((muscle) => {
                const isSelected = selectedMuscle?.id === muscle.id;
                const isHovered = hoveredMuscle === muscle.id;
                const state = isSelected ? 'selected' : isHovered ? 'hover' : 'default';
                const gradientUrl = `url(#${getMuscleGradientId(muscle.id, state)})`;
                const filterAttr = isSelected
                  ? 'url(#muscle-glow-selected)'
                  : isHovered
                    ? 'url(#muscle-glow-hover)'
                    : undefined;

                return (
                  <g
                    key={muscle.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredMuscle(muscle.id)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    onClick={() => setSelectedMuscle(muscle)}
                    filter={filterAttr}
                  >
                    {muscle.paths.map((path, idx) => (
                      <path
                        key={idx}
                        d={path}
                        fill={gradientUrl}
                        stroke={
                          isSelected
                            ? '#c44040'
                            : isHovered
                              ? '#8b2020'
                              : '#3a1515'
                        }
                        strokeWidth={isSelected ? '0.8' : '0.5'}
                        className="transition-all duration-300"
                        strokeLinejoin="round"
                      />
                    ))}
                    {/* Muscle fiber detail lines */}
                    {muscle.fiberLines?.map((line, idx) => (
                      <path
                        key={`fiber-${idx}`}
                        d={line}
                        fill="none"
                        stroke={
                          isSelected
                            ? 'rgba(255,120,120,0.2)'
                            : isHovered
                              ? 'rgba(200,80,80,0.15)'
                              : 'rgba(120,40,40,0.12)'
                        }
                        strokeWidth="0.4"
                        strokeLinecap="round"
                        className="pointer-events-none transition-all duration-300"
                      />
                    ))}
                    {/* Highlight overlay for 3D effect */}
                    {muscle.paths.map((path, idx) => (
                      <path
                        key={`hl-${idx}`}
                        d={path}
                        fill="url(#body-highlight)"
                        stroke="none"
                        className="pointer-events-none"
                        opacity={isSelected ? 0.8 : isHovered ? 0.5 : 0.3}
                      />
                    ))}
                  </g>
                );
              })}

              {/* Center line (subtle spine / linea alba) */}
              <line
                x1="100" y1="84" x2="100" y2="182"
                stroke="#1a0e0e"
                strokeWidth="0.3"
                strokeDasharray="1.5,2.5"
                opacity="0.5"
              />

              {/* Hover tooltip */}
              {hoveredMuscle && !selectedMuscle && (
                <g className="pointer-events-none">
                  <rect x="52" y="6" width="96" height="14" rx="4" fill="#111" fillOpacity="0.9" stroke="#2a1a1a" strokeWidth="0.4" />
                  <text
                    x="100"
                    y="15.5"
                    textAnchor="middle"
                    fill="#e0d0d0"
                    fontSize="5.5"
                    fontWeight="500"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {muscles.find(m => m.id === hoveredMuscle)?.name}
                  </text>
                </g>
              )}
            </svg>

            {/* View label */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-[#444] uppercase tracking-[0.2em] font-medium">
              {view === 'front' ? 'Anterior View' : 'Posterior View'}
            </div>
          </div>
        </div>

        {/* ── Info Panel ── */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          {selectedMuscle ? (
            <div className="animate-fade-in rounded-2xl border border-[#8b1a1a]/20 bg-gradient-to-b from-[#110808] to-[#0a0505] p-5 space-y-4 shadow-[0_0_40px_rgba(139,26,26,0.08)]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">{selectedMuscle.name}</h3>
                  <span className="text-[10px] text-[#8b1a1a] font-semibold uppercase tracking-[0.15em] mt-0.5 inline-block">
                    {view === 'front' ? 'Front' : 'Back'} · Muscle Group
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMuscle(null)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-[#555] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-[#999] leading-relaxed">
                {selectedMuscle.description}
              </p>

              <div>
                <h4 className="text-[10px] font-semibold text-[#555] uppercase tracking-[0.15em] mb-2.5">
                  Recommended Exercises
                </h4>
                <div className="space-y-1.5">
                  {selectedMuscle.exercises.map((ex, i) => (
                    <div
                      key={ex}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[#0e0808] border border-[#1a1212] hover:border-[#8b1a1a]/20 hover:bg-[#120a0a] transition-all duration-200 group"
                    >
                      <span className="text-[10px] font-mono font-bold text-[#8b1a1a] w-5 text-center opacity-60 group-hover:opacity-100 transition-opacity">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-[#ccc] group-hover:text-white transition-colors">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#161616] bg-gradient-to-b from-[#0c0c0c] to-[#080808] p-6 flex flex-col items-center justify-center text-center min-h-[220px] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#8b1a1a]/8 border border-[#8b1a1a]/10 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <circle cx="12" cy="17" r="0.5" fill="#8b1a1a" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#888] font-medium">Select a muscle group</p>
                <p className="text-xs text-[#444] mt-1">to view exercises and details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
