import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { defaultHomeData } from "../src/lib/default-page-data";

const prisma = new PrismaClient();

const GALLERY_SEED = [
  // Fleet
  { src: "/assets/mcso_patrol_header.jpg", label: "Deployment", description: "High-Visibility Patrol Units", category: "Tactical Fleet", sortOrder: 0 },
  { src: "/assets/fleet/fleet_5.jpg", label: "Patrol Unit", description: "Community Security", category: "Tactical Fleet", sortOrder: 1 },
  { src: "/assets/fleet/fleet_3.jpg", label: "Command Response", description: "Dedicated Vehicles", category: "Tactical Fleet", sortOrder: 2 },
  { src: "/assets/fleet/fleet_4.jpg", label: "Night Operations", description: "24/7 Vigilance", category: "Tactical Fleet", sortOrder: 3 },
  { src: "/assets/fleet/fleet_1.jpg", label: "Mobile Units", description: "Versatile Deployment", category: "Tactical Fleet", sortOrder: 4 },
  { src: "/assets/fleet/fleet_2.jpg", label: "Transport", description: "Secure Escorts", category: "Tactical Fleet", sortOrder: 5 },
  { src: "/assets/fleet/fleet_6.jpg", label: "PPU-1", description: "Patrol Pursuit Unit", category: "Tactical Fleet", sortOrder: 6 },
  // Team
  { src: "/assets/field/444.jpg", label: "Field Supervisor", description: "Protection", category: "Meet the Team", sortOrder: 0 },
  { src: "/assets/field/7777.jpg", label: "Operations", description: "Field Commands", category: "Meet the Team", sortOrder: 1 },
  { src: "/assets/field/56.jpg", label: "Supervision", description: "Event Security", category: "Meet the Team", sortOrder: 2 },
  { src: "/assets/field/20220817_102436.jpg", label: "Field Team", description: "Security Detail", category: "Meet the Team", sortOrder: 3 },
  { src: "/assets/field/20240911_134350-2.jpeg", label: "Operational Briefing", description: "Team Brief", category: "Meet the Team", sortOrder: 4 },
  { src: "/assets/field/65.jpg", label: "On-Site Security", description: "Field Work", category: "Meet the Team", sortOrder: 5 },
  // Executive
  { src: "/assets/executive/exec_1.jpg", label: "Close Protection", description: "High-Profile Security", category: "Executive Protection", sortOrder: 0 },
  { src: "/assets/executive/exec_2.jpg", label: "VIP Escort", description: "Discreet Vigilance", category: "Executive Protection", sortOrder: 1 },
  { src: "/assets/executive/exec_3.jpg", label: "Personal Security", description: "Threat Mitigation", category: "Executive Protection", sortOrder: 2 },
  { src: "/assets/field/IMG_20230319_230634_236.jpg", label: "Field Ops", description: "Security Detail", category: "Executive Protection", sortOrder: 3 },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@mcso.local";
  const password = process.env.ADMIN_PASSWORD || "MCSOAdmin2026!";
  const name = process.env.ADMIN_NAME || "MCSO Admin";

  const passwordHash = await hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });

  const pageJson = JSON.stringify(defaultHomeData);
  await prisma.sitePage.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "MCSO Security Group",
      draftData: pageJson,
      publishedData: pageJson,
      publishedAt: new Date(),
    },
  });

  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({ data: GALLERY_SEED });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
