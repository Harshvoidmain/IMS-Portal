import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
  console.error("Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  const email = "dr.smkhot@ims.edu";
  const password = "Principal@123";
  const displayName = "Dr. S. M. Khot";

  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log("User already exists in Auth, updating password...");
      await auth.updateUser(userRecord.uid, { password });
    } catch (e) {
      console.log("Creating new user in Auth...");
      userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });
    }

    const uid = userRecord.uid;
    console.log(`User created/found with UID: ${uid}`);

    // Update custom claims (optional depending on how IMS does it)
    await auth.setCustomUserClaims(uid, { role: "faculty" });

    // Add to 'users' collection
    await db.collection("users").doc(uid).set({
      uid: uid,
      email: email,
      displayName: displayName,
      role: "faculty",
      departmentId: "Computer",
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Add to 'faculty' collection
    // Check if faculty doc already exists for this email
    const facultyQuery = await db.collection("faculty").where("email", "==", email).get();
    if (!facultyQuery.empty) {
      console.log("Faculty doc already exists, updating...");
      await facultyQuery.docs[0].ref.update({
        userId: uid,
        designation: "Principal",
      });
    } else {
      console.log("Creating new faculty doc...");
      const facultyData = {
        displayName: displayName,
        email: email,
        phone: "9999999999",
        gender: "Male",
        address: "Dummy Address, Mumbai",
        departmentId: "Computer",
        designation: "Principal",
        employeeId: "EMP002",
        experience: 15,
        joiningDate: new Date().toISOString(),
        isActive: true,
        sequenceId: "001",
        customId: "COMP-001",
        userId: uid,
        profilePhotoUrl: null,
        qualification: [],
        specialization: [],
        createdAt: FieldValue.serverTimestamp()
      };
      await db.collection("faculty").add(facultyData);
    }

    console.log("-----------------------------------------");
    console.log("SUCCESS!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-----------------------------------------");

  } catch (error) {
    console.error("Error adding faculty:", error);
  }
}

main().then(() => process.exit(0));
