import { MongoClient } from 'mongodb';
import multer from 'multer';
import xlsx from 'xlsx';

const upload = multer({ storage: multer.memoryStorage() });

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await runMiddleware(req, res, upload.single('excelFile'));

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the type (BCM or BDM) from the request
    const testType = req.body.testType || 'BCM'; // Default to BCM if not specified

    // Parse Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    const rawData = xlsx.utils.sheet_to_json(worksheet);
    console.log(`Processing ${testType} data, first few rows:`, rawData.slice(0, 3));

    // Common user fields
    const userFields = {
      armyNo: item => {
        // First try to find Army No in various formats
        const armyNo = item['Army No'] || item['ArmyNo'] || item['army no'] || item['Army No '] || '';
        // If Army No not found, try ID field
        if (!armyNo) {
          return item['ID'] || item['Id'] || item['2. ID'] || '';
        }
        return armyNo;
      },
      name: item => item['Patient Rank Name & Unit'] || item['Patient Rank, Name & Unit'] || item['Name'] || item['1. Name'] || '',
      address: item => item['10. Address'] || '',
      dateOfBirth: item => item['4. Date of Birth'] || '',
      gender: item => item['5. Gender'] || '',
      age: item => item['6. Age'] || '',
      mobileNumber: item => item['7. Mobile Number'] || '',
      phoneNumber: item => item['8. Phone Number'] || '',
      zipCode: item => item['9. Zip Code'] || '',
      email: item => item['11. E-mail'] || '',
    };

    // BCM specific fields
    const bdmFields = {
      bqi: item => item['BQI'] || item['BQI'] || '',
      tScore: item => item['T Score'] || item['t score'] || item['T score'] || '',
      tRatio: item => item['T Ratio'] || item['t ratio'] || item['T ratio'] || '',
      zScore: item => item['Z Score'] || item['z score'] || item['Z score'] || '',
      zRatio: item => item['Z Ratio'] || item['z ratio'] || item['Z ratio'] || '',
      createdAt: () => new Date(),
    };

    // BDM specific fields
    const bcmFields = {
      testDateTime: item => item['14. Test Date / Time'] || '',
      height: item => item['3. Height'] || '',
      dateOfRegistration: item => item['12. Date of Registration'] || '',
      memo: item => item['13. Memo'] || '',
      testDateTime: item => item['14. Test Date / Time'] || '',
      weight: item => item['15. Weight'] || '',
      weightLowerLimit: item => item['16. Lower Limit (Weight Normal Range)'] || '',
      weightUpperLimit: item => item['17. Upper Limit (Weight Normal Range)'] || '',
      tbw: item => item['18. TBW (Total Body Water)'] || '',
      tbwLowerLimit: item => item['19. Lower Limit (TBW Normal Range)'] || '',
      tbwUpperLimit: item => item['20. Upper Limit (TBW Normal Range)'] || '',
      protein: item => item['27. Protein'] || '',
      proteinLowerLimit: item => item['28. Lower Limit (Protein Normal Range)'] || '',
      proteinUpperLimit: item => item['29. Upper Limit (Protein Normal Range)'] || '',
      minerals: item => item['30. Minerals'] || '',
      mineralsLowerLimit: item => item['31. Lower Limit (Minerals Normal Range)'] || '',
      mineralsUpperLimit: item => item['32. Upper Limit (Minerals Normal Range)'] || '',
      bfm: item => item['33. BFM (Body Fat Mass)'] || '',
      bfmLowerLimit: item => item['34. Lower Limit (BFM Normal Range)'] || '',
      bfmUpperLimit: item => item['35. Upper Limit (BFM Normal Range)'] || '',
      slm: item => item['36. SLM (Soft Lean Mass)'] || '',
      slmLowerLimit: item => item['37. Lower Limit (SLM Normal Range)'] || '',
      slmUpperLimit: item => item['38. Upper Limit (SLM Normal Range)'] || '',
      ffm: item => item['39. FFM (Fat Free Mass)'] || '',
      ffmLowerLimit: item => item['40. Lower Limit (FFM Normal Range)'] || '',
      ffmUpperLimit: item => item['41. Upper Limit (FFM Normal Range)'] || '',
      smm: item => item['42. SMM (Skeletal Muscle Mass)'] || '',
      bfmLowerLimit: item => item['34. Lower Limit (BFM Normal Range)'] || '',
      bfmUpperLimit: item => item['35. Upper Limit (BFM Normal Range)'] || '',
      slm: item => item['36. SLM (Soft Lean Mass)'] || '',
      slmLowerLimit: item => item['37. Lower Limit (SLM Normal Range)'] || '',
      slmUpperLimit: item => item['38. Upper Limit (SLM Normal Range)'] || '',
      ffm: item => item['39. FFM (Fat Free Mass)'] || '',
      ffmLowerLimit: item => item['40. Lower Limit (FFM Normal Range)'] || '',
      ffmUpperLimit: item => item['41. Upper Limit (FFM Normal Range)'] || '',
      smm: item => item['42. SMM (Skeletal Muscle Mass)'] || '',
      smmLowerLimit: item => item['43. Lower Limit (SMM Normal Range)'] || '',
      smmUpperLimit: item => item['44. Upper Limit (SMM Normal Range)'] || '',
      bmi: item => item['45. BMI (Body Mass Index)'] || '',
      bmiLowerLimit: item => item['46. Lower Limit (BMI Normal Range)'] || '',
      bmiUpperLimit: item => item['47. Upper Limit (BMI Normal Range)'] || '',
      pbf: item => item['48. PBF (Percent Body Fat)'] || '',
      pbfLowerLimit: item => item['49. Lower Limit (PBF Normal Range)'] || '',
      pbfUpperLimit: item => item['50. Upper Limit (PBF Normal Range)'] || '',
      leanMassRightArm: item => item['51. Lean Mass of Right Arm'] || '',
      leanMassRightArmLowerLimit: item => item['52. Lower Limit (Lean Mass of Right Arm Normal Range)'] || '',
      leanMassRightArmUpperLimit: item => item['53. Upper Limit (Lean Mass of Right Arm Normal Range)'] || '',
      leanMassPercentRightArm: item => item['54. Lean Mass(%) of Right Arm'] || '',
      leanMassLeftArm: item => item['55. Lean Mass of Left Arm'] || '',
      leanMassLeftArmLowerLimit: item => item['56. Lower Limit (Lean Mass of Left Arm Normal Range)'] || '',
      leanMassLeftArmUpperLimit: item => item['57. Upper Limit (Lean Mass of Left Arm Normal Range)'] || '',
      leanMassPercentLeftArm: item => item['58. Lean Mass(%) of Left Arm'] || '',
      leanMassTrunk: item => item['59. Lean Mass of Trunk'] || '',
      leanMassTrunkLowerLimit: item => item['60. Lower Limit (Lean Mass of Trunk Normal Range)'] || '',
      leanMassTrunkUpperLimit: item => item['61. Upper Limit (Lean Mass of Trunk Normal Range)'] || '',
      leanMassPercentTrunk: item => item['62. Lean Mass(%) of Trunk'] || '',
      leanMassRightLeg: item => item['63. Lean Mass of Right Leg'] || '',
      leanMassRightLegLowerLimit: item => item['64. Lower Limit (Lean Mass of Right Leg Normal Range)'] || '',
      leanMassRightLegUpperLimit: item => item['65. Upper Limit (Lean Mass of Right Leg Normal Range)'] || '',
      leanMassPercentRightLeg: item => item['66. Lean Mass(%) of Right Leg'] || '',
      leanMassLeftLeg: item => item['67. Lean Mass of Left Leg'] || '',
      leanMassLeftLegLowerLimit: item => item['68. Lower Limit (Lean Mass of Left Leg Normal Range)'] || '',
      leanMassLeftLegUpperLimit: item => item['69. Upper Limit (Lean Mass of Left Leg Normal Range)'] || '',
      leanMassPercentLeftLeg: item => item['70. Lean Mass(%) of Left Leg'] || '',
      ecwTbwRatio: item => item['71. ECW/TBW'] || '',
      bfmRightArm: item => item['72. BFM of Right Arm'] || '',
      bfmPercentRightArm: item => item['73. BFM% of Right Arm'] || '',
      bfmLeftArm: item => item['74. BFM of Left Arm'] || '',
      bfmPercentLeftArm: item => item['75. BFM% of Left Arm'] || '',
      bfmTrunk: item => item['76. BFM of Trunk'] || '',
      bfmPercentTrunk: item => item['77. BFM% of Trunk'] || '',
      bfmRightLeg: item => item['78. BFM of Right Leg'] || '',
      bfmPercentRightLeg: item => item['79. BFM% of Right Leg'] || '',
      bfmLeftLeg: item => item['80. BFM of Left Leg'] || '',
      bfmPercentLeftLeg: item => item['81. BFM% of Left Leg'] || '',
      inbodyScore: item => item['82. InBody Score'] || '',
      targetWeight: item => item['83. Target Weight'] || '',
      weightControl: item => item['84. Weight Control'] || '',
      bfmControl: item => item['85. BFM Control'] || '',
      ffmControl: item => item['86. FFM Control'] || '',
      bmr: item => item['87. BMR (Basal Metabolic Rate)'] || '',
      whr: item => item['88. WHR (Waist-Hip Ratio)'] || '',
      whrLowerLimit: item => item['89. Lower Limit (WHR Normal Range)'] || '',
      whrUpperLimit: item => item['90. Upper Limit (WHR Normal Range)'] || '',
      vfl: item => item['91. VFL (Visceral Fat Level)'] || '',
      obesityDegree: item => item['92. Obesity Degree'] || '',
      obesityDegreeLowerLimit: item => item['93. Lower Limit (Obesity Degree Normal Range)'] || '',
      obesityDegreeUpperLimit: item => item['94. Upper Limit (Obesity Degree Normal Range)'] || '',
      bcm: item => item['95. BCM (Body Cell Mass)'] || '',
      bcmLowerLimit: item => item['96. Lower Limit (BCM Normal Range)'] || '',
      bcmUpperLimit: item => item['97. Upper Limit (BCM Normal Range)'] || '',
      ac: item => item['98. AC (Arm Circumference)'] || '',
      amc: item => item['99. AMC (Arm Muscle Circumference)'] || '',
      bmc: item => item['100. BMC (Bone Mineral Content)'] || '',
      bmcLowerLimit: item => item['101. Lower Limit (BMC Normal Range)'] || '',
      bmcUpperLimit: item => item['102. Upper Limit (BMC Normal Range)'] || '',
      ffmi: item => item['103. FFMI (Fat Free Mass Index)'] || '',
      fmi: item => item['104. FMI (Fat Mass Index)'] || '',
      neckCircumference: item => item['106. Measured Circumference of Neck'] || '',
      chestCircumference: item => item['107. Measured Circumference of Chest'] || '',
      abdomenCircumference: item => item['108. Measured Circumference of Abdomen'] || '',
      hipCircumference: item => item['109. Measured Circumference of Hip'] || '',
      rightArmCircumference: item => item['110. Measured Circumference of Right Arm'] || '',
      leftArmCircumference: item => item['111. Measured Circumference of Left Arm'] || '',
      rightThighCircumference: item => item['112. Measured Circumference of Right Thigh'] || '',
      leftThighCircumference: item => item['113. Measured Circumference of Left Thigh'] || '',
      systolic: item => item['118. Systolic'] || '',
      diastolic: item => item['119. Diastolic'] || '',
      pulse: item => item['120. Pulse'] || '',
      meanArteryPressure: item => item['121. Mean Artery Pressure'] || '',
      pulsePressure: item => item['122. Pulse Pressure'] || '',
      ratePressureProduct: item => item['123. Rate Pressure Product'] || '',
      inbodyType: item => item['124. InBody Type'] || '',
      smi: item => item['125. SMI (Skeletal Muscle Index)'] || '',
      medicalHistory: item => item['126. Medical History'] || '',
      recommendedCalorieIntake: item => item['128. Recommended Calorie Intake'] || '',
      bmrLowerLimit: item => item['129. Lower Limit (BMR Normal Range)'] || '',
      bmrUpperLimit: item => item['130. Upper Limit (BMR Normal Range)'] || '',
      smmWtRatio: item => item['131. SMM/WT'] || '',
      impedanceCheck: item => item['138. Impedance Check'] || '',
      hgsLeftArm1st: item => item['139. HGS of Left Arm 1st'] || '',
      hgsLeftArm2nd: item => item['140. HGS of Left Arm 2nd'] || '',
      hgsRightArm1st: item => item['141. HGS of Right Arm 1st'] || '',
      hgsRightArm2nd: item => item['142. HGS of Right Arm 2nd'] || '',
      hgsWtRatio: item => item['143. HGS/WT'] || '',
      createdAt: () => new Date(),
    };

    // Process data based on test type
    const processedData = rawData.map((item) => {
      const processedItem = {};
      
      // Add user fields
      Object.keys(userFields).forEach(key => {
        processedItem[key] = userFields[key](item);
      });
      
      // Add type-specific fields under a sub-document
      if (testType === 'BCM') {
        processedItem.bcmData = {};
        Object.keys(bcmFields).forEach(key => {
          processedItem.bcmData[key] = bcmFields[key](item);
        });
      } else if (testType === 'BDM') {
        processedItem.bdmData = {};
        Object.keys(bdmFields).forEach(key => {
          processedItem.bdmData[key] = bdmFields[key](item);
        });
      }
      
      return processedItem;
    });

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // Process each record to update or insert users
    const bulkOps = processedData.map(data => {
      const { armyNo, name, ...testData } = data;
      
      if (!armyNo) {
        throw new Error('Army number is required for all records');
      }
      
      const update = {
        $set: { 
          name,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      };
      
      // Add the test data to the appropriate sub-document
      if (testType === 'BCM') {
        update.$push = { bcmTests: testData.bcmData };
      } else if (testType === 'BDM') {
        update.$push = { bdmTests: testData.bdmData };
      }
      
      return {
        updateOne: {
          filter: { armyNo },
          update,
          upsert: true
        }
      };
    });

    // Execute bulk write operation
    const result = await db.collection('myusers').bulkWrite(bulkOps);
    
    await client.close();

    res.status(200).json({
      message: `Data imported successfully for ${processedData.length} users`,
      count: processedData.length,
      testType,
      insertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
      sampleData: processedData.slice(0, 3),
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ 
      message: 'Error processing file', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}