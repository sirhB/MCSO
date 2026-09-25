/** Default MCSO gallery catalog — used by seed and as API fallback when DB is empty. */
export type DefaultGalleryItem = {
  src: string;
  label: string;
  description: string;
  category: string;
  sortOrder: number;
};

export const DEFAULT_GALLERY: DefaultGalleryItem[] = [
  // Tactical Fleet
  { src: "/assets/mcso_patrol_header.jpg", label: "Deployment", description: "High-Visibility Patrol Units", category: "Tactical Fleet", sortOrder: 0 },
  { src: "/assets/fleet/fleet_5.jpg", label: "Patrol Unit", description: "Community Security", category: "Tactical Fleet", sortOrder: 1 },
  { src: "/assets/fleet/fleet_3.jpg", label: "Command Response", description: "Dedicated Vehicles", category: "Tactical Fleet", sortOrder: 2 },
  { src: "/assets/fleet/fleet_4.jpg", label: "Night Operations", description: "24/7 Vigilance", category: "Tactical Fleet", sortOrder: 3 },
  { src: "/assets/fleet/fleet_1.jpg", label: "Mobile Units", description: "Versatile Deployment", category: "Tactical Fleet", sortOrder: 4 },
  { src: "/assets/fleet/fleet_2.jpg", label: "Transport", description: "Secure Escorts", category: "Tactical Fleet", sortOrder: 5 },
  { src: "/assets/fleet/fleet_6.jpg", label: "PPU-1", description: "Patrol Pursuit Unit", category: "Tactical Fleet", sortOrder: 6 },
  { src: "/assets/fleet/fleet_7.jpg", label: "Marked Unit", description: "Neighborhood Patrol", category: "Tactical Fleet", sortOrder: 7 },
  { src: "/assets/fleet/fleet_8.jpg", label: "Response Vehicle", description: "Rapid Deployment", category: "Tactical Fleet", sortOrder: 8 },
  { src: "/assets/fleet/fleet_9.jpg", label: "Fleet Asset", description: "Operational Support", category: "Tactical Fleet", sortOrder: 9 },
  { src: "/assets/fleet/fleet_10.jpg", label: "Patrol Detail", description: "Active Watch", category: "Tactical Fleet", sortOrder: 10 },
  { src: "/assets/fleet/20260315_233438~4.jpg", label: "Night Patrol", description: "Fleet Vehicle", category: "Tactical Fleet", sortOrder: 11 },
  { src: "/assets/fleet/20260519_142312.jpg", label: "Fleet Unit", description: "Vehicle Patrol", category: "Tactical Fleet", sortOrder: 12 },
  { src: "/assets/fleet/20260519_142321.jpg", label: "Command Unit", description: "Patrol Duties", category: "Tactical Fleet", sortOrder: 13 },
  { src: "/assets/fleet/20260521_190721~2.jpg", label: "Fleet Transport", description: "Secure Vehicle", category: "Tactical Fleet", sortOrder: 14 },
  { src: "/assets/fleet/Screenshot_20260522_020340_Photos.jpg", label: "Mobile Unit", description: "On Duty", category: "Tactical Fleet", sortOrder: 15 },
  { src: "/assets/mcso_patrol_car.jpg", label: "Patrol Car", description: "Marked Presence", category: "Tactical Fleet", sortOrder: 16 },

  // Meet the Team
  { src: "/assets/field/444.jpg", label: "Field Supervisor", description: "Protection", category: "Meet the Team", sortOrder: 0 },
  { src: "/assets/field/7777.jpg", label: "Operations", description: "Field Commands", category: "Meet the Team", sortOrder: 1 },
  { src: "/assets/field/56.jpg", label: "Supervision", description: "Event Security", category: "Meet the Team", sortOrder: 2 },
  { src: "/assets/field/20220817_102436.jpg", label: "Field Team", description: "Security Detail", category: "Meet the Team", sortOrder: 3 },
  { src: "/assets/field/20240911_134350-2.jpeg", label: "Operational Briefing", description: "Team Brief", category: "Meet the Team", sortOrder: 4 },
  { src: "/assets/field/65.jpg", label: "On-Site Security", description: "Field Work", category: "Meet the Team", sortOrder: 5 },
  { src: "/assets/field/Screenshot_20220829-205021_Photos.jpg", label: "Team Deployment", description: "Security Post", category: "Meet the Team", sortOrder: 6 },
  { src: "/assets/field/Screenshot_20221018-212456_PicCollage.jpg", label: "Operations Gallery", description: "Team Photos", category: "Meet the Team", sortOrder: 7 },
  { src: "/assets/field/Screenshot_20240919_073152_Photos.jpg", label: "Night Patrol", description: "Security Guard", category: "Meet the Team", sortOrder: 8 },
  { src: "/assets/field/Screenshot_20240923_160301_Photos.jpg", label: "Active Watch", description: "Field Supervision", category: "Meet the Team", sortOrder: 9 },
  { src: "/assets/field/AISelect_20250630_190149_Photos.jpg", label: "Team Ops", description: "Field Operations", category: "Meet the Team", sortOrder: 10 },
  { src: "/assets/field/Screenshot_20250630_185918_Photos.jpg", label: "Night Ops", description: "24/7 Protection", category: "Meet the Team", sortOrder: 11 },
  { src: "/assets/field/222.jpg", label: "Uniform Presence", description: "Site Coverage", category: "Meet the Team", sortOrder: 12 },
  { src: "/assets/field/555.jpg", label: "Detail Lead", description: "Client Site", category: "Meet the Team", sortOrder: 13 },
  { src: "/assets/field/20240601_130605.jpg", label: "Day Operations", description: "Field Assignment", category: "Meet the Team", sortOrder: 14 },
  { src: "/assets/field/20240911_134510.jpeg", label: "Team Briefing", description: "Pre-Deployment", category: "Meet the Team", sortOrder: 15 },
  { src: "/assets/executive/20260519_142252~2.jpg", label: "Security Detail", description: "Team Brief", category: "Meet the Team", sortOrder: 16 },
  { src: "/assets/executive/20260521_190452.jpg", label: "Active Watch", description: "Field Supervision", category: "Meet the Team", sortOrder: 17 },
  { src: "/assets/executive/Screenshot_20260512_161854_Photos.jpg", label: "Night Patrol", description: "Security Guard", category: "Meet the Team", sortOrder: 18 },

  // Executive Protection
  { src: "/assets/executive/exec_1.jpg", label: "Close Protection", description: "High-Profile Security", category: "Executive Protection", sortOrder: 0 },
  { src: "/assets/executive/exec_2.jpg", label: "VIP Escort", description: "Discreet Vigilance", category: "Executive Protection", sortOrder: 1 },
  { src: "/assets/executive/exec_3.jpg", label: "Personal Security", description: "Threat Mitigation", category: "Executive Protection", sortOrder: 2 },
  { src: "/assets/field/IMG_20230319_230634_236.jpg", label: "Field Ops", description: "Security Detail", category: "Executive Protection", sortOrder: 3 },
  { src: "/assets/field/Screenshot_20230329-211520_Photos.jpg", label: "Operations", description: "Security Detail", category: "Executive Protection", sortOrder: 4 },
  { src: "/assets/field/Screenshot_20230329-211508_Photos.jpg", label: "Operations", description: "Security Detail", category: "Executive Protection", sortOrder: 5 },
  { src: "/assets/field/Screenshot_20241129_012440_Photos.jpg", label: "Security", description: "Security Detail", category: "Executive Protection", sortOrder: 6 },
  { src: "/assets/field/Screenshot_20230403-231452_Photos.jpg", label: "Night Watch", description: "24/7 Security", category: "Executive Protection", sortOrder: 7 },
  { src: "/assets/field/Screenshot_20241212_021617_Photos.png", label: "Security Log", description: "Operational Overview", category: "Executive Protection", sortOrder: 8 },
  { src: "/assets/field/Screenshot_20250630_185746_Photos.jpg", label: "Tactical Ops", description: "Field Work", category: "Executive Protection", sortOrder: 9 },
  { src: "/assets/field/Screenshot_20250630_190022_Photos.jpg", label: "Response Team", description: "Deployment", category: "Executive Protection", sortOrder: 10 },
  { src: "/assets/field/Screenshot_20260222_080411_Photos.jpg", label: "Monitoring", description: "Security Systems", category: "Executive Protection", sortOrder: 11 },
  { src: "/assets/executive/Screenshot_20260521_212413_Photos.jpg", label: "Close Protection", description: "VIP Escort", category: "Executive Protection", sortOrder: 12 },
  { src: "/assets/executive/Screenshot_20260521_212510_Photos.jpg", label: "Personal Security", description: "Threat Mitigation", category: "Executive Protection", sortOrder: 13 },
  { src: "/assets/executive/Screenshot_20260521_212516_Photos.jpg", label: "Security Detail", description: "Operations", category: "Executive Protection", sortOrder: 14 },
  { src: "/assets/executive/Screenshot_20260522_032914_Photos.jpg", label: "VIP Protection", description: "Discreet Vigilance", category: "Executive Protection", sortOrder: 15 },
  { src: "/assets/executive/20260519_142224~2.jpg", label: "Executive Detail", description: "Client Movement", category: "Executive Protection", sortOrder: 16 },
  { src: "/assets/field/Hi Value Luxery Auto Group Detail.jpg", label: "High-Value Detail", description: "Asset Escort", category: "Executive Protection", sortOrder: 17 },
];

export function defaultGalleryAsApiItems() {
  return DEFAULT_GALLERY.map((item, index) => ({
    id: `default-${index}`,
    src: item.src,
    label: item.label,
    description: item.description,
    category: item.category,
    sortOrder: item.sortOrder,
    createdAt: new Date(0).toISOString(),
  }));
}
