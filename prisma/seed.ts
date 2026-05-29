// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function createClient() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Connecting to:", connectionString?.substring(0, 40) + "...");
  if (!connectionString) throw new Error("DATABASE_URL is not set!");
  const mod = await import("../src/generated/prisma/client.js");
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new mod.PrismaClient({ adapter });
}

const colleges = [
  { name: "IIT Bombay", slug: "iit-bombay", city: "Mumbai", state: "Maharashtra", type: "IIT", rating: 4.8, established: 1958, affiliation: "UGC, AICTE", description: "Indian Institute of Technology Bombay is a premier engineering institution known for its cutting-edge research and world-class faculty.", location: "Powai, Mumbai, Maharashtra", website: "https://www.iitb.ac.in", fees: { btech: 250000, mtech: 20000 }, ranking: { nirf: 3, qs: 149 }, highlights: { campusSize: "550 acres", hostel: true, wifi: true }, banner: "/colleges/iit-bombay.jpeg" },
  { name: "IIT Delhi", slug: "iit-delhi", city: "New Delhi", state: "Delhi", type: "IIT", rating: 4.7, established: 1961, affiliation: "UGC, AICTE", description: "Indian Institute of Technology Delhi is among the top engineering colleges in India.", location: "Hauz Khas, New Delhi, Delhi", website: "https://home.iitd.ac.in", fees: { btech: 230000, mtech: 18000 }, ranking: { nirf: 2, qs: 150 }, highlights: { campusSize: "320 acres", hostel: true, wifi: true }, banner: "/colleges/iit-delhi.jpeg" },
  { name: "IIT Madras", slug: "iit-madras", city: "Chennai", state: "Tamil Nadu", type: "IIT", rating: 4.9, established: 1959, affiliation: "UGC, AICTE", description: "IIT Madras is consistently ranked #1 in India for engineering.", location: "Adyar, Chennai, Tamil Nadu", website: "https://www.iitm.ac.in", fees: { btech: 225000, mtech: 17500 }, ranking: { nirf: 1, qs: 227 }, highlights: { campusSize: "617 acres", hostel: true, wifi: true }, banner: "/colleges/iit-madras.jpg" },
  { name: "IIT Kanpur", slug: "iit-kanpur", city: "Kanpur", state: "Uttar Pradesh", type: "IIT", rating: 4.6, established: 1959, affiliation: "UGC, AICTE", description: "IIT Kanpur is known for strong research output and academics.", location: "Kalyanpur, Kanpur, Uttar Pradesh", website: "https://www.iitk.ac.in", fees: { btech: 220000, mtech: 17000 }, ranking: { nirf: 4, qs: 264 }, highlights: { campusSize: "1055 acres", hostel: true, wifi: true }, banner: "/colleges/iit-kanpur.jpg" },
  { name: "IIT Kharagpur", slug: "iit-kharagpur", city: "Kharagpur", state: "West Bengal", type: "IIT", rating: 4.5, established: 1951, affiliation: "UGC, AICTE", description: "The first IIT established in India with the largest campus.", location: "Kharagpur, West Bengal", website: "https://www.iitkgp.ac.in", fees: { btech: 220000, mtech: 16000 }, ranking: { nirf: 5, qs: 271 }, highlights: { campusSize: "2100 acres", hostel: true, wifi: true }, banner: "/colleges/iit-kharakpur.jpg" },
  { name: "IIT Indore", slug: "iit-indore", city: "Indore", state: "Madhya Pradesh", type: "IIT", rating: 4.2, established: 2009, affiliation: "UGC, AICTE", description: "IIT Indore is one of the third-generation IITs, rapidly growing in research output and academic excellence with a modern campus and innovative programs.", location: "Simrol, Indore, Madhya Pradesh", website: "https://www.iiti.ac.in", fees: { btech: 220000, mtech: 17000 }, ranking: { nirf: 14, qs: 800 }, highlights: { campusSize: "510 acres", hostel: true, wifi: true }, banner: "/colleges/iit-indore.jpeg" },
  { name: "NIT Trichy", slug: "nit-trichy", city: "Tiruchirappalli", state: "Tamil Nadu", type: "NIT", rating: 4.3, established: 1964, affiliation: "AICTE", description: "NIT Trichy is the top-ranked NIT in India.", location: "Tiruchirappalli, Tamil Nadu", website: "https://www.nitt.edu", fees: { btech: 150000, mtech: 60000 }, ranking: { nirf: 9 }, highlights: { campusSize: "800 acres", hostel: true, wifi: true }, banner: "/colleges/nit-tricky.jpeg" },
  { name: "NIT Warangal", slug: "nit-warangal", city: "Warangal", state: "Telangana", type: "NIT", rating: 4.2, established: 1959, affiliation: "AICTE", description: "NIT Warangal is one of the premier NITs of India.", location: "Warangal, Telangana", website: "https://www.nitw.ac.in", fees: { btech: 145000, mtech: 55000 }, ranking: { nirf: 12 }, highlights: { campusSize: "260 acres", hostel: true, wifi: true }, banner: "/colleges/nit-warangal.jpg" },
  { name: "NIT Surathkal", slug: "nit-surathkal", city: "Mangalore", state: "Karnataka", type: "NIT", rating: 4.3, established: 1960, affiliation: "AICTE", description: "NITK Surathkal is known for excellent placements and campus life.", location: "Surathkal, Mangalore, Karnataka", website: "https://www.nitk.ac.in", fees: { btech: 155000, mtech: 58000 }, ranking: { nirf: 10 }, highlights: { campusSize: "295 acres", hostel: true, wifi: true }, banner: "/colleges/nit-surathkal.jpg" },
  { name: "BITS Pilani", slug: "bits-pilani", city: "Pilani", state: "Rajasthan", type: "Private", rating: 4.5, established: 1964, affiliation: "UGC", description: "BITS Pilani is one of India's top private engineering universities.", location: "Vidya Vihar, Pilani, Rajasthan", website: "https://www.bits-pilani.ac.in", fees: { btech: 520000, mtech: 300000 }, ranking: { nirf: 15 }, highlights: { campusSize: "328 acres", hostel: true, wifi: true }, banner: "/colleges/bits-pilani.jpeg" },
  { name: "VIT Vellore", slug: "vit-vellore", city: "Vellore", state: "Tamil Nadu", type: "Private", rating: 4.1, established: 1984, affiliation: "UGC, AICTE", description: "VIT is a top private university known for its engineering programs.", location: "Vellore, Tamil Nadu", website: "https://vit.ac.in", fees: { btech: 395000, mtech: 200000 }, ranking: { nirf: 11 }, highlights: { campusSize: "600 acres", hostel: true, wifi: true }, banner: "/colleges/vit-vellore.jpg" },
  { name: "IIIT Hyderabad", slug: "iiit-hyderabad", city: "Hyderabad", state: "Telangana", type: "IIIT", rating: 4.6, established: 1998, affiliation: "UGC", description: "IIIT Hyderabad is a top research-focused CS institution.", location: "Gachibowli, Hyderabad, Telangana", website: "https://www.iiit.ac.in", fees: { btech: 350000, mtech: 150000 }, ranking: { nirf: 20 }, highlights: { campusSize: "66 acres", hostel: true, wifi: true }, banner: "/colleges/iit-hydrabad.jpeg" },
  { name: "DTU Delhi", slug: "dtu-delhi", city: "New Delhi", state: "Delhi", type: "State", rating: 4.2, established: 1941, affiliation: "AICTE", description: "Delhi Technological University is a premier state engineering university.", location: "Shahbad Daulatpur, New Delhi, Delhi", website: "http://www.dtu.ac.in", fees: { btech: 170000, mtech: 80000 }, ranking: { nirf: 25 }, highlights: { campusSize: "164 acres", hostel: true, wifi: true }, banner: "/colleges/dtu-delhi.jpg" },
  { name: "IIT Roorkee", slug: "iit-roorkee", city: "Roorkee", state: "Uttarakhand", type: "IIT", rating: 4.5, established: 1847, affiliation: "UGC, AICTE", description: "Asia's oldest technical institution, now an IIT.", location: "Roorkee, Uttarakhand", website: "https://www.iitr.ac.in", fees: { btech: 225000, mtech: 17000 }, ranking: { nirf: 6, qs: 369 }, highlights: { campusSize: "365 acres", hostel: true, wifi: true }, banner: "/colleges/iit-roorkee.jpeg" },
  { name: "IIT Guwahati", slug: "iit-guwahati", city: "Guwahati", state: "Assam", type: "IIT", rating: 4.4, established: 1994, affiliation: "UGC, AICTE", description: "IIT Guwahati has one of the most beautiful campuses in India.", location: "North Guwahati, Assam", website: "https://www.iitg.ac.in", fees: { btech: 220000, mtech: 17000 }, ranking: { nirf: 7, qs: 344 }, highlights: { campusSize: "700 acres", hostel: true, wifi: true }, banner: "/colleges/iit-guhati.png" },
  { name: "IIT Hyderabad", slug: "iit-hyderabad", city: "Hyderabad", state: "Telangana", type: "IIT", rating: 4.3, established: 2008, affiliation: "UGC, AICTE", description: "IIT Hyderabad is among the fastest-growing new IITs.", location: "Kandi, Sangareddy, Telangana", website: "https://iith.ac.in", fees: { btech: 230000, mtech: 17000 }, ranking: { nirf: 8, qs: 541 }, highlights: { campusSize: "576 acres", hostel: true, wifi: true }, banner: "/colleges/iit-hydrabad.jpeg" },
  { name: "NIT Calicut", slug: "nit-calicut", city: "Kozhikode", state: "Kerala", type: "NIT", rating: 4.1, established: 1961, affiliation: "AICTE", description: "NIT Calicut is a top NIT in South India.", location: "Kozhikode, Kerala", website: "https://www.nitc.ac.in", fees: { btech: 140000, mtech: 50000 }, ranking: { nirf: 18 }, highlights: { campusSize: "115 acres", hostel: true, wifi: true }, banner: "/colleges/nit-calicut.jpg" },
  { name: "Jadavpur University", slug: "jadavpur-university", city: "Kolkata", state: "West Bengal", type: "State", rating: 4.2, established: 1955, affiliation: "UGC", description: "Jadavpur University is a premier public university in Kolkata.", location: "Jadavpur, Kolkata, West Bengal", website: "http://www.jaduniv.edu.in", fees: { btech: 15000, mtech: 10000 }, ranking: { nirf: 16 }, highlights: { campusSize: "60 acres", hostel: true, wifi: true }, banner: "/colleges/jadava-university.jpg" },
  { name: "SRM IST Chennai", slug: "srm-ist-chennai", city: "Chennai", state: "Tamil Nadu", type: "Private", rating: 3.9, established: 1985, affiliation: "UGC, AICTE", description: "SRM Institute of Science and Technology is a top private university.", location: "Kattankulathur, Chennai, Tamil Nadu", website: "https://www.srmist.edu.in", fees: { btech: 450000, mtech: 250000 }, ranking: { nirf: 30 }, highlights: { campusSize: "250 acres", hostel: true, wifi: true }, banner: "/colleges/srm-ist-chennai.jpg" },
  { name: "Manipal Institute of Technology", slug: "manipal-it", city: "Manipal", state: "Karnataka", type: "Private", rating: 4.0, established: 1957, affiliation: "UGC, AICTE", description: "MIT Manipal is a well-known private engineering college.", location: "Manipal, Udupi, Karnataka", website: "https://manipal.edu/mit.html", fees: { btech: 480000, mtech: 280000 }, ranking: { nirf: 28 }, highlights: { campusSize: "600 acres", hostel: true, wifi: true }, banner: "/colleges/manipal-institue-of-technologu.jpg" },
  { name: "IIIT Delhi", slug: "iiit-delhi", city: "New Delhi", state: "Delhi", type: "IIIT", rating: 4.4, established: 2008, affiliation: "UGC", description: "IIIT Delhi is a state university focused on IT and CS education.", location: "Okhla, New Delhi, Delhi", website: "https://iiitd.ac.in", fees: { btech: 380000, mtech: 180000 }, ranking: { nirf: 22 }, highlights: { campusSize: "25 acres", hostel: true, wifi: true }, banner: "/colleges/dtu-delhi.jpg" },
];

const coursesData = [
  { degree: "B.Tech", name: "Computer Science Engineering", duration: "4 years", seats: 120 },
  { degree: "B.Tech", name: "Electrical Engineering", duration: "4 years", seats: 100 },
  { degree: "B.Tech", name: "Mechanical Engineering", duration: "4 years", seats: 100 },
  { degree: "M.Tech", name: "Computer Science", duration: "2 years", seats: 50 },
  { degree: "M.Tech", name: "Data Science", duration: "2 years", seats: 30 },
  { degree: "MBA", name: "Business Administration", duration: "2 years", seats: 60 },
];

function getPlacementData(type: string, rating: number) {
  const base = type === "IIT" ? 20 : type === "NIT" ? 12 : type === "IIIT" ? 16 : 8;
  const mult = rating / 4.5;
  return {
    year: 2024,
    avgPackage: +(base * mult).toFixed(2),
    medianPackage: +(base * mult * 0.7).toFixed(2),
    highestPackage: +(base * mult * 5).toFixed(2),
    lowestPackage: +(base * mult * 0.3).toFixed(2),
    placementPercentage: +(70 + rating * 5).toFixed(1),
    topRecruiters: type === "IIT"
      ? ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Adobe", "Flipkart"]
      : type === "NIT"
      ? ["TCS", "Infosys", "Microsoft", "Amazon", "Wipro", "Cognizant"]
      : ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Capgemini"],
  };
}

async function main() {
  const prisma = await createClient();
  console.log("Seeding database...");

  await prisma.savedComparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  for (const c of colleges) {
    const college = await prisma.college.create({ data: c });
    console.log(`Created: ${college.name}`);

    const feeBase = (c.fees as Record<string, number>).btech || 200000;
    for (const course of coursesData) {
      const feeMultiplier = course.degree === "MBA" ? 2.5 : course.degree === "M.Tech" ? 0.5 : 1;
      await prisma.course.create({
        data: {
          collegeId: college.id,
          ...course,
          fees: feeBase * feeMultiplier,
          feesType: "annual",
          eligibility: course.degree === "B.Tech" ? "JEE Main/Advanced" : course.degree === "M.Tech" ? "GATE" : "CAT/MAT",
        },
      });
    }

    const pData = getPlacementData(c.type, c.rating);
    await prisma.placement.create({
      data: { collegeId: college.id, ...pData },
    });
  }

  console.log(`\nSeeded ${colleges.length} colleges with courses and placements.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); });
