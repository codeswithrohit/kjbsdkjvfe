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

const processExcelFile = (buffer, fileType) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

const getCommonFields = (item) => {
  console.log('Available Excel fields for comman:', Object.keys(item));
  return {
    armyNo: item['Army No'] || item['ArmyNo'] || item['army no'] || item['Army No '] || item['ARMY NO '] || item['ID'] || item['Id'] || item['2. ID'] || '',
    name: item['Patient Rank Name & Unit'] || item['Patient Rank, Name & Unit'] || item['Name'] || item['1. Name'] || '',
    rank: item['Rank'] || item['Rank'] || item['RANK'] || item['RANK'] || '',
    address: item['10. Address'] || '',
    dateOfBirth: item['4. Date of Birth'] || '',
    gender: item['5. Gender'] || '',
    age: item['6. Age'] || '',
    mobileNumber: item['7. Mobile Number'] || '',
    phoneNumber: item['8. Phone Number'] || '',
    zipCode: item['9. Zip Code'] || '',
    email: item['11. E-mail'] || '',
  };
};

const getBdmFields = (item) => {
  console.log('Available Excel fields for BDM:', Object.keys(item));
  return {
    bqi: item['BQI'] || '',
    tScore: item['T Score'] || item['t score'] || item['T score'] || '',
    tRatio: item['T Ratio'] || item['t ratio'] || item['T ratio'] || '',
    zScore: item['Z Score'] || item['z score'] || item['Z score'] || '',
    zRatio: item['Z Ratio'] || item['z ratio'] || item['Z ratio'] || '',
  };
};

const getBcmFields = (item) => {
  console.log('Available Excel fields for BCA:', Object.keys(item));
  const controlFields = {
    targetWeight: item['TARGET WEIGHT'] || '',
  };

  return {
    testDateTime: item['14. Test Date / Time'] || '',
    height: item['3. Height'] || '',
    controlFields,
    dateOfRegistration: item['12. Date of Registration'] || '',
    memo: item['13. Memo'] || '',
    weight: item['15. Weight'] || '',
    weightLowerLimit: item['16. Lower Limit (Weight Normal Range)'] || '',
    weightUpperLimit: item['17. Upper Limit (Weight Normal Range)'] || '',
    tbw: item['18. TBW (Total Body Water)'] || '',
    tbwLowerLimit: item['19. Lower Limit (TBW Normal Range)'] || '',
    tbwUpperLimit: item['20. Upper Limit (TBW Normal Range)'] || '',
    protein: item['27. Protein'] || '',
    proteinLowerLimit: item['28. Lower Limit (Protein Normal Range)'] || '',
    proteinUpperLimit: item['29. Upper Limit (Protein Normal Range)'] || '',
    minerals: item['30. Minerals'] || '',
    mineralsLowerLimit: item['31. Lower Limit (Minerals Normal Range)'] || '',
    mineralsUpperLimit: item['32. Upper Limit (Minerals Normal Range)'] || '',
    bfm: item['33. BFM (Body Fat Mass)'] || '',
    bfmLowerLimit: item['34. Lower Limit (BFM Normal Range)'] || '',
    bfmUpperLimit: item['35. Upper Limit (BFM Normal Range)'] || '',
    slm: item['36. SLM (Soft Lean Mass)'] || '',
    slmLowerLimit: item['37. Lower Limit (SLM Normal Range)'] || '',
    slmUpperLimit: item['38. Upper Limit (SLM Normal Range)'] || '',
    ffm: item['39. FFM (Fat Free Mass)'] || '',
    ffmLowerLimit: item['40. Lower Limit (FFM Normal Range)'] || '',
    ffmUpperLimit: item['41. Upper Limit (FFM Normal Range)'] || '',
    smm: item['42. SMM (Skeletal Muscle Mass)'] || '',
    smmLowerLimit: item['43. Lower Limit (SMM Normal Range)'] || '',
    smmUpperLimit: item['44. Upper Limit (SMM Normal Range)'] || '',
    bmi: item['45. BMI (Body Mass Index)'] || '',
    bmiLowerLimit: item['46. Lower Limit (BMI Normal Range)'] || '',
    bmiUpperLimit: item['47. Upper Limit (BMI Normal Range)'] || '',
    pbf: item['48. PBF (Percent Body Fat)'] || '',
    pbfLowerLimit: item['49. Lower Limit (PBF Normal Range)'] || '',
    pbfUpperLimit: item['50. Upper Limit (PBF Normal Range)'] || '',
    leanMassRightArm: item['51. Lean Mass of Right Arm'] || '',
    leanMassRightArmLowerLimit: item['52. Lower Limit (Lean Mass of Right Arm Normal Range)'] || '',
    leanMassRightArmUpperLimit: item['53. Upper Limit (Lean Mass of Right Arm Normal Range)'] || '',
    leanMassPercentRightArm: item['54. Lean Mass(%) of Right Arm'] || '',
    leanMassLeftArm: item['55. Lean Mass of Left Arm'] || '',
    leanMassLeftArmLowerLimit: item['56. Lower Limit (Lean Mass of Left Arm Normal Range)'] || '',
    leanMassLeftArmUpperLimit: item['57. Upper Limit (Lean Mass of Left Arm Normal Range)'] || '',
    leanMassPercentLeftArm: item['58. Lean Mass(%) of Left Arm'] || '',
    leanMassTrunk: item['59. Lean Mass of Trunk'] || '',
    leanMassTrunkLowerLimit: item['60. Lower Limit (Lean Mass of Trunk Normal Range)'] || '',
    leanMassTrunkUpperLimit: item['61. Upper Limit (Lean Mass of Trunk Normal Range)'] || '',
    leanMassPercentTrunk: item['62. Lean Mass(%) of Trunk'] || '',
    leanMassRightLeg: item['63. Lean Mass of Right Leg'] || '',
    leanMassRightLegLowerLimit: item['64. Lower Limit (Lean Mass of Right Leg Normal Range)'] || '',
    leanMassRightLegUpperLimit: item['65. Upper Limit (Lean Mass of Right Leg Normal Range)'] || '',
    leanMassPercentRightLeg: item['66. Lean Mass(%) of Right Leg'] || '',
    leanMassLeftLeg: item['67. Lean Mass of Left Leg'] || '',
    leanMassLeftLegLowerLimit: item['68. Lower Limit (Lean Mass of Left Leg Normal Range)'] || '',
    leanMassLeftLegUpperLimit: item['69. Upper Limit (Lean Mass of Left Leg Normal Range)'] || '',
    leanMassPercentLeftLeg: item['70. Lean Mass(%) of Left Leg'] || '',
    ecwTbwRatio: item['71. ECW/TBW'] || '',
    bfmRightArm: item['72. BFM of Right Arm'] || '',
    bfmPercentRightArm: item['73. BFM% of Right Arm'] || '',
    bfmLeftArm: item['74. BFM of Left Arm'] || '',
    bfmPercentLeftArm: item['75. BFM% of Left Arm'] || '',
    bfmTrunk: item['76. BFM of Trunk'] || '',
    bfmPercentTrunk: item['77. BFM% of Trunk'] || '',
    bfmRightLeg: item['78. BFM of Right Leg'] || '',
    bfmPercentRightLeg: item['79. BFM% of Right Leg'] || '',
    bfmLeftLeg: item['80. BFM of Left Leg'] || '',
    bfmPercentLeftLeg: item['81. BFM% of Left Leg'] || '',
    inbodyScore: item['82. InBody Score'] || '',
    targetWeight: item['83. Target Weight'] || '',
    weightControl: item['84. Weight Control'] || '',
    bfmControl: item['85. BFM Control'] || '',
    ffmControl: item['86. FFM Control'] || '',
    bmr: item['87. BMR (Basal Metabolic Rate)'] || '',
    whr: item['88. WHR (Waist-Hip Ratio)'] || '',
    whrLowerLimit: item['89. Lower Limit (WHR Normal Range)'] || '',
    whrUpperLimit: item['90. Upper Limit (WHR Normal Range)'] || '',
    vfl: item['91. VFL (Visceral Fat Level)'] || '',
    obesityDegree: item['92. Obesity Degree'] || '',
    obesityDegreeLowerLimit: item['93. Lower Limit (Obesity Degree Normal Range)'] || '',
    obesityDegreeUpperLimit: item['94. Upper Limit (Obesity Degree Normal Range)'] || '',
    bcm: item['95. BCM (Body Cell Mass)'] || '',
    bcmLowerLimit: item['96. Lower Limit (BCM Normal Range)'] || '',
    bcmUpperLimit: item['97. Upper Limit (BCM Normal Range)'] || '',
    ac: item['98. AC (Arm Circumference)'] || '',
    amc: item['99. AMC (Arm Muscle Circumference)'] || '',
    bmc: item['100. BMC (Bone Mineral Content)'] || '',
    bmcLowerLimit: item['101. Lower Limit (BMC Normal Range)'] || '',
    bmcUpperLimit: item['102. Upper Limit (BMC Normal Range)'] || '',
    ffmi: item['103. FFMI (Fat Free Mass Index)'] || '',
    fmi: item['104. FMI (Fat Mass Index)'] || '',
    neckCircumference: item['106. Measured Circumference of Neck'] || '',
    chestCircumference: item['107. Measured Circumference of Chest'] || '',
    abdomenCircumference: item['108. Measured Circumference of Abdomen'] || '',
    hipCircumference: item['109. Measured Circumference of Hip'] || '',
    rightArmCircumference: item['110. Measured Circumference of Right Arm'] || '',
    leftArmCircumference: item['111. Measured Circumference of Left Arm'] || '',
    rightThighCircumference: item['112. Measured Circumference of Right Thigh'] || '',
    leftThighCircumference: item['113. Measured Circumference of Left Thigh'] || '',
    systolic: item['118. Systolic'] || '',
    diastolic: item['119. Diastolic'] || '',
    pulse: item['120. Pulse'] || '',
    meanArteryPressure: item['121. Mean Artery Pressure'] || '',
    pulsePressure: item['122. Pulse Pressure'] || '',
    ratePressureProduct: item['123. Rate Pressure Product'] || '',
    inbodyType: item['124. InBody Type'] || '',
    smi: item['125. SMI (Skeletal Muscle Index)'] || '',
    medicalHistory: item['126. Medical History'] || '',
    recommendedCalorieIntake: item['128. Recommended Calorie Intake'] || '',
    bmrLowerLimit: item['129. Lower Limit (BMR Normal Range)'] || '',
    bmrUpperLimit: item['130. Upper Limit (BMR Normal Range)'] || '',
    smmWtRatio: item['131. SMM/WT'] || '',
    impedanceCheck: item['138. Impedance Check'] || '',
    hgsLeftArm1st: item['139. HGS of Left Arm 1st'] || '',
    hgsLeftArm2nd: item['140. HGS of Left Arm 2nd'] || '',
    hgsRightArm1st: item['141. HGS of Right Arm 1st'] || '',
    hgsRightArm2nd: item['142. HGS of Right Arm 2nd'] || '',
    hgsWtRatio: item['143. HGS/WT'] || ''
  };
};

const getBpetFields = (item) => {
  console.log('Available Excel fields for BPET:', Object.keys(item));
  return {
    fivekmrunning: item['5 KM RUNNING'] || '',
    sixtymsprint: item['60 M SPRINT'] || '',
    horizontalrope: item['HORIZONTAL ROPE'] || '',
    verticalrope: item['VERTICAL ROPE'] || '',
    nineftditch: item['9 FT DITCH'] || '',
    overall: item['OVERALL'] || '',
    result: item['RESULT'] || '',
    testDate: item['Test Date'] || '',
  };
};

const getPptFields = (item) => {
  console.log('Available Excel fields for PPT:', Object.keys(item));
  return {
    twopointfourkmrun: item['2.4 Km Run Ex-20 Good-16 Sat-12'] || '',
    chinup: item['Chin Up Ex-10 Good-8 Sat-6'] || '',
    toetouch: item['Toe Touch Ex-8 Good-7 Sat-6'] || '',
    situp: item['Sit Up Ex-40 Good-7 Sat-6'] || '',
    fivemtrshuttle: item['5 mtr Shuttle Ex-17 Good-16 Sat-15'] || '',
    hundredmtrsprint: item['100 m Sprint Ex-13 Sec Good-15 Sec Sat-17 Sec'] || '',
    totalpoints: item['Total Points (100)'] || '',
    result: item['Result'] || '',
    remarks: item['Remarks'] || '',
  };
};

const getBcaFields = (item) => {
  return {
    analysisDate: item['Analysis Date'] || '',
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Process the multipart form data
    await runMiddleware(req, res, upload.any());

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const batchNo = req.body.batchNo || 'AV001';
    const testDate = req.body.testDate || new Date().toISOString().split('T')[0];
    const processedFiles = {};

    // Process each uploaded file
    for (const file of req.files) {
      const fileType = file.fieldname; // BPET, PPT, BDM, or BCA
      const rawData = processExcelFile(file.buffer, fileType);
      
      const processedData = rawData.map((item) => {
        const commonFields = getCommonFields(item);
        let typeSpecificFields = {};
        
        switch(fileType) {
          case 'BDM':
            typeSpecificFields = { bdmData: getBdmFields(item) };
            break;
          case 'BPET':
            typeSpecificFields = { bpetData: getBpetFields(item) };
            break;
          case 'PPT':
            typeSpecificFields = { pptData: getPptFields(item) };
            break;
          case 'BCA':
            typeSpecificFields = { bcaData: getBcaFields(item) };
            break;
          default:
            typeSpecificFields = { bcmData: getBcmFields(item) };
        }
        
        return {
          ...commonFields,
          ...typeSpecificFields,
          batchNo,
          testDate,
          createdAt: new Date()
        };
      });

      processedFiles[fileType] = processedData;
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // Prepare bulk operations for all files
    const bulkOps = [];
    
    // Process each file type and create bulk operations
    for (const [fileType, data] of Object.entries(processedFiles)) {
      for (const item of data) {
        const { armyNo, name, batchNo, testDate, ...testData } = item;
        
        // if (!armyNo) {
        //   throw new Error('Army number is required for all records');
        // }
        
        const update = {
          $set: { 
            name,
            updatedAt: new Date(),
            batchNo,
            testDate
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        };
        
        // Add the test data to the appropriate sub-document
        const testType = Object.keys(testData)[0]; // bdmData, bpetData, etc.
        if (testType) {
          update.$push = { [testType]: testData[testType] };
        }
        
        bulkOps.push({
          updateOne: {
            filter: { armyNo },
            update,
            upsert: true
          }
        });
      }
    }

    // Execute bulk write operation
    const result = await db.collection('myusers').bulkWrite(bulkOps);
    await client.close();

    res.status(200).json({
      message: `Data imported successfully for batch ${batchNo} with test date ${testDate}`,
      batchNo,
      testDate,
      fileCount: req.files.length,
      insertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
      sampleData: processedFiles[Object.keys(processedFiles)[0]]?.slice(0, 3),
    });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ 
      message: 'Error processing files', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}