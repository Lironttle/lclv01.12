'use client';

import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

interface MuscleGroup {
  id: string;
  name: string;
  exercises: string[];
  description: string;
  paths: string[];
}

const frontMuscles: MuscleGroup[] = [
  {
    id: 'front-traps',
    name: 'Trapezius',
    description: 'The trapezius extends from the neck to the mid-back and helps move, rotate, and stabilise the shoulder blades.',
    exercises: ['Barbell Shrugs', 'Face Pulls', 'Upright Rows', 'Farmer\'s Walks'],
    paths: [
      'M 82,88 Q 88,82 100,80 Q 112,82 118,88 L 114,96 Q 100,92 86,96 Z',
    ],
  },
  {
    id: 'front-deltoids-l',
    name: 'Deltoids (Left)',
    description: 'The anterior deltoid is responsible for shoulder flexion and internal rotation. Well-developed front delts give width to your frame.',
    exercises: ['Overhead Press', 'Front Raises', 'Arnold Press', 'Lateral Raises'],
    paths: [
      'M 72,96 Q 68,100 66,112 Q 68,118 72,120 L 80,108 Q 82,98 80,94 Z',
    ],
  },
  {
    id: 'front-deltoids-r',
    name: 'Deltoids (Right)',
    description: 'The anterior deltoid is responsible for shoulder flexion and internal rotation. Well-developed front delts give width to your frame.',
    exercises: ['Overhead Press', 'Front Raises', 'Arnold Press', 'Lateral Raises'],
    paths: [
      'M 128,96 Q 132,100 134,112 Q 132,118 128,120 L 120,108 Q 118,98 120,94 Z',
    ],
  },
  {
    id: 'front-pecs',
    name: 'Pectorals',
    description: 'The pectoral muscles are the large chest muscles responsible for pushing movements and arm adduction.',
    exercises: ['Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Dips'],
    paths: [
      'M 82,96 Q 86,94 100,93 Q 114,94 118,96 L 120,108 Q 116,116 100,118 Q 84,116 80,108 Z',
    ],
  },
  {
    id: 'front-biceps-l',
    name: 'Biceps (Left)',
    description: 'The biceps brachii flexes the elbow and supinates the forearm. It\'s one of the most visible upper arm muscles.',
    exercises: ['Barbell Curls', 'Hammer Curls', 'Incline Dumbbell Curls', 'Preacher Curls'],
    paths: [
      'M 68,120 Q 64,130 62,142 Q 64,148 68,148 Q 72,142 74,130 Q 74,124 72,120 Z',
    ],
  },
  {
    id: 'front-biceps-r',
    name: 'Biceps (Right)',
    description: 'The biceps brachii flexes the elbow and supinates the forearm. It\'s one of the most visible upper arm muscles.',
    exercises: ['Barbell Curls', 'Hammer Curls', 'Incline Dumbbell Curls', 'Preacher Curls'],
    paths: [
      'M 132,120 Q 136,130 138,142 Q 136,148 132,148 Q 128,142 126,130 Q 126,124 128,120 Z',
    ],
  },
  {
    id: 'front-forearms-l',
    name: 'Forearms (Left)',
    description: 'The forearm muscles control wrist and finger movements, and are essential for grip strength.',
    exercises: ['Wrist Curls', 'Reverse Curls', 'Dead Hangs', 'Farmer\'s Walks'],
    paths: [
      'M 62,150 Q 58,165 56,182 Q 58,186 62,186 Q 66,178 68,165 Q 68,155 66,150 Z',
    ],
  },
  {
    id: 'front-forearms-r',
    name: 'Forearms (Right)',
    description: 'The forearm muscles control wrist and finger movements, and are essential for grip strength.',
    exercises: ['Wrist Curls', 'Reverse Curls', 'Dead Hangs', 'Farmer\'s Walks'],
    paths: [
      'M 138,150 Q 142,165 144,182 Q 142,186 138,186 Q 134,178 132,165 Q 132,155 134,150 Z',
    ],
  },
  {
    id: 'front-abs',
    name: 'Abdominals',
    description: 'The rectus abdominis and transverse abdominis provide core stability, trunk flexion, and protect internal organs.',
    exercises: ['Hanging Leg Raises', 'Cable Crunches', 'Ab Wheel Rollouts', 'Planks'],
    paths: [
      'M 88,120 Q 86,140 86,170 Q 88,180 92,184 Q 96,186 100,186 Q 104,186 108,184 Q 112,180 114,170 Q 114,140 112,120 Q 108,118 100,118 Q 92,118 88,120 Z',
    ],
  },
  {
    id: 'front-obliques-l',
    name: 'Obliques (Left)',
    description: 'The obliques are responsible for torso rotation and lateral flexion. They help define the waistline.',
    exercises: ['Cable Woodchops', 'Russian Twists', 'Side Planks', 'Pallof Press'],
    paths: [
      'M 80,112 L 86,120 Q 84,145 84,170 L 80,172 Q 78,150 78,130 Z',
    ],
  },
  {
    id: 'front-obliques-r',
    name: 'Obliques (Right)',
    description: 'The obliques are responsible for torso rotation and lateral flexion. They help define the waistline.',
    exercises: ['Cable Woodchops', 'Russian Twists', 'Side Planks', 'Pallof Press'],
    paths: [
      'M 120,112 L 114,120 Q 116,145 116,170 L 120,172 Q 122,150 122,130 Z',
    ],
  },
  {
    id: 'front-quads-l',
    name: 'Quadriceps (Left)',
    description: 'The quadriceps are the large four-headed muscle group on the front of the thigh, essential for knee extension.',
    exercises: ['Barbell Squats', 'Leg Press', 'Lunges', 'Leg Extensions'],
    paths: [
      'M 84,190 Q 82,210 80,240 Q 80,260 82,280 Q 84,286 88,286 Q 92,280 94,260 Q 96,240 96,220 Q 96,200 94,190 Z',
    ],
  },
  {
    id: 'front-quads-r',
    name: 'Quadriceps (Right)',
    description: 'The quadriceps are the large four-headed muscle group on the front of the thigh, essential for knee extension.',
    exercises: ['Barbell Squats', 'Leg Press', 'Lunges', 'Leg Extensions'],
    paths: [
      'M 116,190 Q 118,210 120,240 Q 120,260 118,280 Q 116,286 112,286 Q 108,280 106,260 Q 104,240 104,220 Q 104,200 106,190 Z',
    ],
  },
  {
    id: 'front-adductors',
    name: 'Adductors (Inner Thigh)',
    description: 'The adductor muscles pull the legs together and stabilise the hips during movement.',
    exercises: ['Sumo Squats', 'Cable Adductions', 'Copenhagen Planks', 'Adductor Machine'],
    paths: [
      'M 94,192 Q 97,210 98,230 L 100,230 L 102,230 Q 103,210 106,192 Q 102,188 100,186 Q 98,188 94,192 Z',
    ],
  },
  {
    id: 'front-tibialis-l',
    name: 'Tibialis Anterior (Left)',
    description: 'The tibialis anterior runs along the shin and is responsible for dorsiflexion of the foot.',
    exercises: ['Tibialis Raises', 'Toe Walks', 'Ankle Dorsiflexion', 'Sled Drags (Backward)'],
    paths: [
      'M 82,290 Q 80,310 78,340 Q 78,360 80,370 Q 84,374 88,370 Q 90,360 90,340 Q 90,320 88,290 Z',
    ],
  },
  {
    id: 'front-tibialis-r',
    name: 'Tibialis Anterior (Right)',
    description: 'The tibialis anterior runs along the shin and is responsible for dorsiflexion of the foot.',
    exercises: ['Tibialis Raises', 'Toe Walks', 'Ankle Dorsiflexion', 'Sled Drags (Backward)'],
    paths: [
      'M 118,290 Q 120,310 122,340 Q 122,360 120,370 Q 116,374 112,370 Q 110,360 110,340 Q 110,320 112,290 Z',
    ],
  },
];

const backMuscles: MuscleGroup[] = [
  {
    id: 'back-traps',
    name: 'Trapezius',
    description: 'The trapezius is a large triangular muscle spanning from the neck to the mid-back, crucial for posture and scapular movement.',
    exercises: ['Barbell Shrugs', 'Face Pulls', 'Rack Pulls', 'Farmer\'s Walks'],
    paths: [
      'M 82,88 Q 88,82 100,80 Q 112,82 118,88 L 116,100 Q 112,110 100,114 Q 88,110 84,100 Z',
    ],
  },
  {
    id: 'back-rear-delts-l',
    name: 'Rear Deltoids (Left)',
    description: 'The posterior deltoid is responsible for shoulder extension and external rotation. Often underdeveloped, it\'s critical for balanced shoulders.',
    exercises: ['Reverse Flyes', 'Face Pulls', 'Bent-Over Dumbbell Raises', 'Cable Rear Delt Flyes'],
    paths: [
      'M 72,96 Q 68,100 66,112 Q 68,118 72,120 L 80,108 Q 82,98 80,94 Z',
    ],
  },
  {
    id: 'back-rear-delts-r',
    name: 'Rear Deltoids (Right)',
    description: 'The posterior deltoid is responsible for shoulder extension and external rotation. Often underdeveloped, it\'s critical for balanced shoulders.',
    exercises: ['Reverse Flyes', 'Face Pulls', 'Bent-Over Dumbbell Raises', 'Cable Rear Delt Flyes'],
    paths: [
      'M 128,96 Q 132,100 134,112 Q 132,118 128,120 L 120,108 Q 118,98 120,94 Z',
    ],
  },
  {
    id: 'back-lats',
    name: 'Latissimus Dorsi',
    description: 'The lats are the broadest muscles of the back, responsible for pulling movements and creating the V-taper physique.',
    exercises: ['Pull-Ups', 'Barbell Rows', 'Lat Pulldowns', 'Seated Cable Rows'],
    paths: [
      'M 80,110 Q 76,130 78,155 Q 82,168 88,172 Q 94,170 96,160 Q 96,140 94,120 Z',
      'M 120,110 Q 124,130 122,155 Q 118,168 112,172 Q 106,170 104,160 Q 104,140 106,120 Z',
    ],
  },
  {
    id: 'back-triceps-l',
    name: 'Triceps (Left)',
    description: 'The triceps brachii makes up two-thirds of the upper arm. It\'s responsible for elbow extension.',
    exercises: ['Close-Grip Bench Press', 'Tricep Dips', 'Skull Crushers', 'Cable Pushdowns'],
    paths: [
      'M 68,120 Q 64,130 62,142 Q 64,148 68,148 Q 72,142 74,130 Q 74,124 72,120 Z',
    ],
  },
  {
    id: 'back-triceps-r',
    name: 'Triceps (Right)',
    description: 'The triceps brachii makes up two-thirds of the upper arm. It\'s responsible for elbow extension.',
    exercises: ['Close-Grip Bench Press', 'Tricep Dips', 'Skull Crushers', 'Cable Pushdowns'],
    paths: [
      'M 132,120 Q 136,130 138,142 Q 136,148 132,148 Q 128,142 126,130 Q 126,124 128,120 Z',
    ],
  },
  {
    id: 'back-forearms-l',
    name: 'Forearms (Left)',
    description: 'The posterior forearm muscles control wrist extension and are important for grip strength and arm aesthetics.',
    exercises: ['Reverse Wrist Curls', 'Reverse Curls', 'Towel Hangs', 'Farmer\'s Walks'],
    paths: [
      'M 62,150 Q 58,165 56,182 Q 58,186 62,186 Q 66,178 68,165 Q 68,155 66,150 Z',
    ],
  },
  {
    id: 'back-forearms-r',
    name: 'Forearms (Right)',
    description: 'The posterior forearm muscles control wrist extension and are important for grip strength and arm aesthetics.',
    exercises: ['Reverse Wrist Curls', 'Reverse Curls', 'Towel Hangs', 'Farmer\'s Walks'],
    paths: [
      'M 138,150 Q 142,165 144,182 Q 142,186 138,186 Q 134,178 132,165 Q 132,155 134,150 Z',
    ],
  },
  {
    id: 'back-erector',
    name: 'Erector Spinae (Lower Back)',
    description: 'The erector spinae muscles run along the spine and are critical for maintaining posture and spinal extension.',
    exercises: ['Deadlifts', 'Back Extensions', 'Good Mornings', 'Romanian Deadlifts'],
    paths: [
      'M 92,116 Q 90,140 90,165 Q 92,178 96,182 L 100,184 L 104,182 Q 108,178 110,165 Q 110,140 108,116 Q 104,114 100,114 Q 96,114 92,116 Z',
    ],
  },
  {
    id: 'back-glutes',
    name: 'Glutes',
    description: 'The gluteal muscles are the largest muscle group in the body. They are essential for hip extension, power, and posture.',
    exercises: ['Hip Thrusts', 'Bulgarian Split Squats', 'Romanian Deadlifts', 'Glute Bridges'],
    paths: [
      'M 82,180 Q 80,190 82,200 Q 86,208 94,210 Q 98,210 100,208 L 100,186 Q 92,184 82,180 Z',
      'M 118,180 Q 120,190 118,200 Q 114,208 106,210 Q 102,210 100,208 L 100,186 Q 108,184 118,180 Z',
    ],
  },
  {
    id: 'back-hamstrings-l',
    name: 'Hamstrings (Left)',
    description: 'The hamstrings are three muscles on the back of the thigh responsible for knee flexion and hip extension.',
    exercises: ['Romanian Deadlifts', 'Leg Curls', 'Nordic Curls', 'Glute-Ham Raises'],
    paths: [
      'M 84,212 Q 82,230 80,255 Q 80,270 82,280 Q 84,286 88,286 Q 92,280 94,265 Q 96,245 96,225 Q 96,215 94,212 Z',
    ],
  },
  {
    id: 'back-hamstrings-r',
    name: 'Hamstrings (Right)',
    description: 'The hamstrings are three muscles on the back of the thigh responsible for knee flexion and hip extension.',
    exercises: ['Romanian Deadlifts', 'Leg Curls', 'Nordic Curls', 'Glute-Ham Raises'],
    paths: [
      'M 116,212 Q 118,230 120,255 Q 120,270 118,280 Q 116,286 112,286 Q 108,280 106,265 Q 104,245 104,225 Q 104,215 106,212 Z',
    ],
  },
  {
    id: 'back-calves-l',
    name: 'Calves (Left)',
    description: 'The gastrocnemius and soleus form the calf muscles, responsible for plantarflexion and explosive lower body movements.',
    exercises: ['Standing Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises', 'Jump Rope'],
    paths: [
      'M 82,290 Q 80,310 78,335 Q 78,355 80,370 Q 84,376 88,370 Q 92,355 92,335 Q 92,315 88,290 Z',
    ],
  },
  {
    id: 'back-calves-r',
    name: 'Calves (Right)',
    description: 'The gastrocnemius and soleus form the calf muscles, responsible for plantarflexion and explosive lower body movements.',
    exercises: ['Standing Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises', 'Jump Rope'],
    paths: [
      'M 118,290 Q 120,310 122,335 Q 122,355 120,370 Q 116,376 112,370 Q 108,355 108,335 Q 108,315 112,290 Z',
    ],
  },
];

// Head shape (decorative, not clickable)
const headPath = 'M 92,40 Q 92,24 100,20 Q 108,24 108,40 Q 108,52 106,58 Q 104,62 100,64 Q 96,62 94,58 Q 92,52 92,40 Z';
// Neck
const neckPath = 'M 95,64 L 95,80 Q 97,82 100,82 Q 103,82 105,80 L 105,64 Z';
// Hands
const handPathL = 'M 56,186 Q 52,194 50,198 Q 52,202 56,200 Q 58,196 60,190 Z';
const handPathR = 'M 144,186 Q 148,194 150,198 Q 148,202 144,200 Q 142,196 140,190 Z';
// Feet
const footPathL = 'M 76,374 Q 74,382 72,388 Q 76,392 82,392 Q 88,390 90,384 Q 90,378 88,374 Z';
const footPathR = 'M 124,374 Q 126,382 128,388 Q 124,392 118,392 Q 112,390 110,384 Q 110,378 112,374 Z';
// Knee caps (front view)
const kneePathL = 'M 84,282 Q 82,286 82,290 Q 84,294 88,294 Q 92,294 92,290 Q 92,286 90,282 Z';
const kneePathR = 'M 116,282 Q 118,286 118,290 Q 116,294 112,294 Q 108,294 108,290 Q 108,286 110,282 Z';

export default function InteractiveMuscleMap() {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  const muscles = view === 'front' ? frontMuscles : backMuscles;

  return (
    <div className="rounded-xl border border-[#222] bg-[#111] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Interactive Muscle Map</h2>
        {/* Front / Back toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setView('front'); setSelectedMuscle(null); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'front'
                ? 'bg-[#730404] text-white shadow-[0_0_12px_rgba(115,4,4,0.4)]'
                : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#222] hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => { setView('back'); setSelectedMuscle(null); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'back'
                ? 'bg-[#730404] text-white shadow-[0_0_12px_rgba(115,4,4,0.4)]'
                : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#222] hover:text-white'
            }`}
          >
            Back
          </button>
          <button
            onClick={() => { setView(v => v === 'front' ? 'back' : 'front'); setSelectedMuscle(null); }}
            className="ml-1 p-1.5 rounded-lg bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#222] hover:text-white transition-all"
            title="Rotate view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* SVG Body */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative w-full max-w-[320px]">
            <svg
              viewBox="30 10 140 400"
              className="w-full h-auto"
              style={{ maxHeight: '520px' }}
            >
              {/* Body outline parts (non-interactive) */}
              {/* Head */}
              <path d={headPath} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
              {/* Neck */}
              <path d={neckPath} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
              {/* Hands */}
              <path d={handPathL} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
              <path d={handPathR} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
              {/* Feet */}
              <path d={footPathL} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
              <path d={footPathR} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
              {/* Knee caps (front) or back-of-knee area */}
              <path d={kneePathL} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
              <path d={kneePathR} fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />

              {/* Muscle groups */}
              {muscles.map((muscle) => (
                <g
                  key={muscle.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredMuscle(muscle.id)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => setSelectedMuscle(muscle)}
                >
                  {muscle.paths.map((path, idx) => (
                    <path
                      key={idx}
                      d={path}
                      fill={
                        selectedMuscle?.id === muscle.id
                          ? '#730404'
                          : hoveredMuscle === muscle.id
                            ? '#5a0303'
                            : '#2a0808'
                      }
                      stroke={
                        selectedMuscle?.id === muscle.id
                          ? '#a31515'
                          : hoveredMuscle === muscle.id
                            ? '#730404'
                            : '#3a1111'
                      }
                      strokeWidth="0.8"
                      className="transition-all duration-200"
                      style={{
                        filter:
                          selectedMuscle?.id === muscle.id
                            ? 'drop-shadow(0 0 6px rgba(115,4,4,0.6))'
                            : hoveredMuscle === muscle.id
                              ? 'drop-shadow(0 0 3px rgba(115,4,4,0.3))'
                              : 'none',
                      }}
                    />
                  ))}
                  {/* Hover tooltip label */}
                  {hoveredMuscle === muscle.id && !selectedMuscle && (
                    <text
                      x="100"
                      y="16"
                      textAnchor="middle"
                      fill="white"
                      fontSize="6"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {muscle.name}
                    </text>
                  )}
                </g>
              ))}

              {/* Center line (subtle anatomy reference) */}
              <line x1="100" y1="80" x2="100" y2="186" stroke="#1a1010" strokeWidth="0.3" strokeDasharray="2,3" />
            </svg>

            {/* View label */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-[#666] uppercase tracking-widest">
              {view === 'front' ? 'Anterior View' : 'Posterior View'}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          {selectedMuscle ? (
            <div className="animate-fade-in rounded-xl border border-[#730404]/30 bg-[#0e0808] p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{selectedMuscle.name}</h3>
                  <span className="text-xs text-[#730404] font-medium uppercase tracking-wider">
                    {view === 'front' ? 'Front' : 'Back'} · Muscle Group
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMuscle(null)}
                  className="p-1 rounded-md hover:bg-white/5 text-[#666] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-[#a3a3a3] leading-relaxed">
                {selectedMuscle.description}
              </p>

              <div>
                <h4 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Recommended Exercises
                </h4>
                <div className="space-y-1.5">
                  {selectedMuscle.exercises.map((ex, i) => (
                    <div
                      key={ex}
                      className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#111] border border-[#1a1a1a] hover:border-[#730404]/30 transition-colors"
                    >
                      <span className="text-xs font-mono text-[#730404]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm text-white">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 flex flex-col items-center justify-center text-center min-h-[200px] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#730404]/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#730404" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#a3a3a3]">Click on any muscle group</p>
                <p className="text-xs text-[#666] mt-1">to see exercises and details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
