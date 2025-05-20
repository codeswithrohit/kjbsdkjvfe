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
    await runMiddleware(req, res, upload.fields([
      { name: 'bcmFile', maxCount: 1 },
      { name: 'bdmFile', maxCount: 1 },
      { name: 'bpetFile', maxCount: 1 },
      { name: 'pptFile', maxCount: 1 },
    ]));

    const { batchnumber, testDate } = req.body;
    
    if (!batchnumber || !testDate) {
      return res.status(400).json({ message: 'Batch Number and Test Date are required' });
    }
    if (!req.files.bcmFile && !req.files.bdmFile && !req.files.bpetFile && !req.files.pptFile) {
      return res.status(400).json({ message: 'Please upload at least one file (BCM, BDM, BPET, or PPT)' });
    }

    // Common user fields
    const userFields = {
      armyNo: item => {
        const armyNo = item['Army No'] || item['ArmyNo'] || item['army no'] || item['Army No '] || item['ARMY NO'] || item['__EMPTY'] || '';
        if (!armyNo) {
          return item['ID'] || item['Id'] || item['2. ID'] || '';
        }
        return armyNo;
      },
      name: item => item['Patient Rank Name & Unit'] || item['Patient Rank, Name & Unit'] || item['Name'] || item['NAME'] || item['1. Name'] || item['__EMPTY_2'] || '',
      rank: item => item['RANK'] || item['Rank'] || item['rank'] || item['__EMPTY_1'] || '',
      batchnumber: () => batchnumber,
      address: item => item['10. Address'] || '',
      dateOfBirth: item => item['4. Date of Birth'] || '',
      gender: item => item['5. Gender'] || '',
      age: item => item['6. Age'] || '',
      mobileNumber: item => item['7. Mobile Number'] || '',
      phoneNumber: item => item['8. Phone Number'] || '',
      zipCode: item => item['9. Zip Code'] || '',
      email: item => item['11. E-mail'] || '',
      profileimage: item => item['11. E-mail'] || '',
      batchnumber: () => batchnumber,
    };

    // Create a unique batch identifier combining batch number and date
    const batchIdentifier = `${batchnumber}_${new Date(testDate).toISOString().split('T')[0]}`;

    // BDM specific fields
    const bdmFields = {
      tScore: item => item['T Score'] || item['t score'] || item['T score'] || item['__EMPTY_6'] || item['__EMPTY_7'] ||  '',
      tRatio: item => item['T Ratio'] || item['t ratio'] || item['T ratio'] || '',
      zScore: item => item['Z Score'] || item['z score'] || item['Z score'] || item['__EMPTY_7'] || '',
      zRatio: item => item['Z Ratio'] || item['z ratio'] || item['Z ratio'] || item['__EMPTY_8'] || '',
      result: item => item['RESULT'] || item['Result'] || item['result'] || item['__EMPTY_4'] || '',
      remarks: item => item['REMARKS'] || item['Remarks'] || item['remarks'] || item['__EMPTY_9'] || '',
      batchnumber: () => batchnumber,
      batchIdentifier: () => batchIdentifier,
      testdates: () => testDate,
      createdAt: () => new Date(),
    };

    const bpetFields = {
      fivekmrunning: item => item['5 KM RUNNING'] || item['5KM RUNNING'] || item['5 km running'] || item['__EMPTY_4'] || '',
      sixtymsprint: item => item['60 M SPRINT'] || item['60M SPRINT'] || item['60 m sprint'] || item['__EMPTY_5'] || '',
      horizontalrope: item => item['HORIZONTAL ROPE'] || item['Horizontal Rope'] || item['horizontal rope'] || item['__EMPTY_6'] || '',
      verticalrope: item => item['VERTICAL ROPE'] || item['Vertical Rope'] || item['vertical rope'] || item['__EMPTY_7'] || '',
      nineftditch: item => item['9 FT DITCH'] || item['9FT DITCH'] || item['9 ft ditch'] || item['__EMPTY_8'] || '',
      overall: item => item['OVERALL'] || item['Overall'] || item['overall'] || item['__EMPTY_9'] || '',
      result: item => item['RESULT'] || item['Result'] || item['result'] || item['__EMPTY_10'] || '',
      chNo: item => item['CH NO'] || item['Ch No'] || item['ch no'] || item['__EMPTY_3'] || '',
      remarks: item => item['REMARKS'] || item['Remarks'] || item['remarks'] || item['__EMPTY_11'] || '',
      testDate: () => testDate,
      batchnumber: () => batchnumber,
      batchIdentifier: () => batchIdentifier,
      createdAt: () => new Date(),
    };
    const pptFields = {
      twopointfourkmrun: item => item['__EMPTY_4'] || '',
      chinup: item => item['__EMPTY_5'] || '',
      toetouch: item => item['__EMPTY_6'] || '',
      situp: item => item['__EMPTY_7'] || '',
      fivemtrshuttle: item => item['__EMPTY_8'] || '',
      hundredmtrsprint: item => item['__EMPTY_9'] || '',
      totalpoints: item => item['__EMPTY_10'] || '',
      result: item => item['__EMPTY_11'] || '',
      remarks: item => item['__EMPTY_12'] || '',
      batchnumber: () => batchnumber,
      batchIdentifier: () => batchIdentifier,
      testdates: () => testDate,
      createdAt: () => new Date(),
    };


    // BCM specific fields
    const bcmFields = {
      testDateTime: item => item['14. Test Date / Time'] || '',
      height: item => item['3. Height'] || '',
      dateOfRegistration: item => item['12. Date of Registration'] || '',
      memo: item => item['13. Memo'] || '',
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
      hb: item => item['Hb'] || '',
      batchnumber: () => batchnumber,
      batchIdentifier: () => batchIdentifier,
      testdates: () => testDate,
      createdAt: () => new Date(),
    };

    // Process BCM data if file exists
 // Process BCM data if file exists
// Process BCM data if file exists
let bcmProcessedData = [];
console.log('BCM file detected, starting processing...');
if (req.files.bcmFile) {
  const bcmWorkbook = xlsx.read(req.files.bcmFile[0].buffer, { type: 'buffer' });
  const bcmSheetName = bcmWorkbook.SheetNames[0];
  const bcmWorksheet = bcmWorkbook.Sheets[bcmSheetName];
  const bcmRawData = xlsx.utils.sheet_to_json(bcmWorksheet);
  console.log('First 3 raw BCM records:', bcmRawData.slice(0, 3));

  // Determine which format we're dealing with
  const isNumberedFormat = bcmRawData[0] && bcmRawData[0]['1. Name'] !== undefined;
  
  if (isNumberedFormat) {
    // Process the numbered format (new format)
    bcmProcessedData = bcmRawData
      .filter(item => item['1. Name'] && item['2. ID']) // Skip empty rows
      .map((item, index) => {
        const processedItem = {};
        
        // Add user fields
        processedItem.armyNo = item['2. ID'] || '';
        processedItem.name = item['1. Name'] || '';
        processedItem.rank = ''; // Not available in this format
        processedItem.batchnumber = batchnumber;
        
        // Add all BCM fields from the numbered format
        processedItem.bcmData = {};
        Object.keys(bcmFields).forEach(key => {
          // For numbered format, we need to map the numbered fields to our standard field names
          processedItem.bcmData[key] = bcmFields[key](item);
        });

        // Add batch information
        processedItem.bcmData.batchnumber = batchnumber;
        processedItem.bcmData.batchIdentifier = batchIdentifier;
        processedItem.bcmData.testdates = testDate;
        processedItem.bcmData.createdAt = new Date();

        if (index < 5) {
          console.log(`BCM Record ${index + 1} (numbered format):`, processedItem);
        }
        return processedItem;
      });
  } else {
    // Process the old format (with __EMPTY fields)
    bcmProcessedData = bcmRawData
      .filter(item => item.__EMPTY && item.__EMPTY !== 'ARMY NO') // Skip header rows
      .map((item, index) => {
        const processedItem = {};
        
        // Add user fields
        processedItem.armyNo = item.__EMPTY || '';
        processedItem.name = item.__EMPTY_2 || '';
        processedItem.rank = item.__EMPTY_1 || '';
        processedItem.batchnumber = batchnumber;
        
        // Add BCM fields with specific mapping for this format
        processedItem.bcmData = {
          height: item.__EMPTY_5 || '',
          weight: item.__EMPTY_6 || '',
          bmi: item.__EMPTY_7 || '',
          pbf: item.__EMPTY_8 || '',
          targetWeight: item.__EMPTY_9 || '',
          weightControl: item.__EMPTY_10 || '',
          bfmControl: item.__EMPTY_11 || '',
          ffmControl: item.__EMPTY_12 || '',
          bodyBalance: item.__EMPTY_13 || '',
          hb: item.__EMPTY_14 || '',
          previousHb: item.__EMPTY_15 || '',
          remarks: item.__EMPTY_16 || '',
          age: item.__EMPTY_4 || '',
          batchnumber: batchnumber,
          batchIdentifier: batchIdentifier,
          testdates: testDate,
          createdAt: new Date()
        };

        if (index < 5) {
          console.log(`BCM Record ${index + 1} (old format):`, processedItem);
        }
        return processedItem;
      });
  }
}

    // Process BDM data if file exists
    let bdmProcessedData = [];
    if (req.files.bdmFile) {
      console.log('BDM file detected, starting processing...');
      const bdmWorkbook = xlsx.read(req.files.bdmFile[0].buffer, { type: 'buffer' });
      const bdmSheetName = bdmWorkbook.SheetNames[0];
      const bdmWorksheet = bdmWorkbook.Sheets[bdmSheetName];
      const bdmRawData = xlsx.utils.sheet_to_json(bdmWorksheet);
      
      console.log('First 3 raw BDM records:', bdmRawData.slice(0, 3));
      
      // Check which format we're dealing with
      const isNewFormat = bdmRawData[0] && bdmRawData[0]['Sr. No.'] !== undefined;
      
      bdmProcessedData = bdmRawData
        .filter(item => {
          if (isNewFormat) {
            // New format filtering
            return item['Army No '] && item['Army No '] !== 'ARMY NO';
          } else {
            // Old format filtering
            const armyNo = item['__EMPTY'] || '';
            return armyNo && armyNo !== 'ARMY NO' && !isNaN(parseInt(item["BONE DENSITY TEST 'C' COY"]));
          }
        })
        .map((item, index) => {
          const processedItem = {};
          
          // Add user fields
          if (isNewFormat) {
            processedItem.armyNo = item['Army No '] || '';
            processedItem.name = item['Patient Rank, Name & Unit'] || '';
            processedItem.rank = ''; // You may need to extract rank from name in new format
          } else {
            Object.keys(userFields).forEach(key => {
              processedItem[key] = userFields[key](item);
            });
          }
          
          // Add BDM fields
          processedItem.bdmData = {};
          if (isNewFormat) {
            processedItem.bdmData.tScore = item['T score'] || '';
            processedItem.bdmData.tRatio = item['T ratio'] || '';
            processedItem.bdmData.zScore = item['Z score'] || '';
            processedItem.bdmData.zRatio = item['Z ratio'] || '';
            processedItem.bdmData.result = ''; // Not in new format sample
            processedItem.bdmData.remarks = ''; // Not in new format sample
          } else {
            Object.keys(bdmFields).forEach(key => {
              processedItem.bdmData[key] = bdmFields[key](item);
            });
          }
          
          // Common fields
          processedItem.bdmData.batchnumber = batchnumber;
          processedItem.bdmData.batchIdentifier = batchIdentifier;
          processedItem.bdmData.testdates = testDate;
          processedItem.bdmData.createdAt = new Date();
          
          // Log first 5 records for debugging
          if (index < 5) {
            console.log(`BDM Record ${index + 1}:`, processedItem);
          }
          
          return processedItem;
        });
    }



    let bpetProcessedData = [];
    if (req.files.bpetFile) {
      // console.log('BPET file detected, starting processing...');
      const bpetWorkbook = xlsx.read(req.files.bpetFile[0].buffer, { type: 'buffer' });
      const bpetSheetName = bpetWorkbook.SheetNames[0];
      const bpetWorksheet = bpetWorkbook.Sheets[bpetSheetName];
      
      // Convert to JSON with header row
      const bpetRawData = xlsx.utils.sheet_to_json(bpetWorksheet, { defval: '' });
      
      // console.log(`BPET raw data contains ${bpetRawData.length} records`);
      // console.log('First 3 raw BPET records:', bpetRawData.slice(0, 3));
    
      bpetProcessedData = bpetRawData
        .filter(item => item.__EMPTY && item.__EMPTY !== 'ARMY NO') // Skip header row and empty rows
        .map((item, index) => {
          const processedItem = {};
          
          // Add user fields with specific column mapping
          processedItem.armyNo = item['ARMY NO'] || item['Army No'] || item['__EMPTY'] || '';
          processedItem.name = item['NAME'] || item['Name'] || item['__EMPTY_2'] || '';
          processedItem.rank = item['RANK'] || item['Rank'] || item['__EMPTY_1'] || '';
          processedItem.batchnumber = batchnumber;
          
          // Add BPET fields
          processedItem.bpetData = {};
          Object.keys(bpetFields).forEach(key => {
            processedItem.bpetData[key] = bpetFields[key](item);
          });
      
          // Log first 5 records for debugging
          // if (index < 5) {
          //   console.log(`BPET Record ${index + 1}:`, processedItem);
          // }
          
          return processedItem;
        });
    
      // console.log(`Processed ${bpetProcessedData.length} BPET records`);
    }

    let pptProcessedData = [];
    if (req.files.pptFile) {
      // console.log('PPT file detected, starting processing...');
      const pptWorkbook = xlsx.read(req.files.pptFile[0].buffer, { type: 'buffer' });
      const pptSheetName = pptWorkbook.SheetNames[0];
      const pptWorksheet = pptWorkbook.Sheets[pptSheetName];
      const pptRawData = xlsx.utils.sheet_to_json(pptWorksheet);
      
      // console.log(`PPT raw data contains ${pptRawData.length} records`);
      // console.log('First 3 raw PPT records:', pptRawData.slice(0, 3));
      
      pptProcessedData = pptRawData
        .filter(item => item.__EMPTY && item.__EMPTY !== 'Army No') // Skip header row and empty rows
        .map((item, index) => {
          const processedItem = {};
          
          // Add user fields with specific column mapping
          processedItem.armyNo = item['__EMPTY'] || '';
          processedItem.name = item['__EMPTY_2'] || '';
          processedItem.rank = item['__EMPTY_1'] || '';
          processedItem.batchnumber = batchnumber;
          
          // Add PPT fields
          processedItem.pptData = {};
          Object.keys(pptFields).forEach(key => {
            processedItem.pptData[key] = pptFields[key](item);
          });
          
          // if (index < 5) {
          //   console.log(`PPT Record ${index + 1}:`, processedItem);
          // }
          return processedItem;
        });
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // Prepare bulk operations
    const bulkOps = [];
    const allUsers = [...bcmProcessedData, ...bdmProcessedData, ...bpetProcessedData, ...pptProcessedData];
    if (allUsers.length === 0) {
      await client.close();
      return res.status(400).json({ 
        message: 'No valid data found in the uploaded files. Please check the file formats.' 
      });
    }

    const uniqueUsers = Array.from(new Set(allUsers.map(user => user.armyNo)));

    // Process each unique user
    for (const armyNo of uniqueUsers) {
      const user = allUsers.find(u => u.armyNo === armyNo);
      if (!user) continue;

      const update = {
        $set: { 
          name: user.name,
          rank: user.rank,
          batchnumber: batchnumber,
          updatedAt: new Date(),
          profileimage: user.armyNo ? `/${user.armyNo}.jpg` : ''
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      };
      
      // Add BCM test data if available for this user
      const bcmUserData = bcmProcessedData.find(u => u.armyNo === armyNo);
      if (bcmUserData) {
        // Check if this batch already exists for this user
        const existingBatch = await db.collection('myusers').findOne({
          armyNo,
          'bcmTests.batchIdentifier': batchIdentifier
        });
        
        if (!existingBatch) {
          update.$push = { 
            ...(update.$push || {}),
            bcmTests: bcmUserData.bcmData 
          };
        }
      }
      
      // Add BDM test data if available for this user
      const bdmUserData = bdmProcessedData.find(u => u.armyNo === armyNo);
      if (bdmUserData) {
        // Check if this batch already exists for this user
        const existingBatch = await db.collection('myusers').findOne({
          armyNo,
          'bdmTests.batchIdentifier': batchIdentifier
        });
        
        if (!existingBatch) {
          update.$push = { 
            ...(update.$push || {}),
            bdmTests: bdmUserData.bdmData 
          };
        }
      }



      const bpetUserData = bpetProcessedData.find(u => u.armyNo === armyNo);
      if (bpetUserData) {
        // Check if this batch already exists for this user
        const existingBatch = await db.collection('myusers').findOne({
          armyNo,
          'bpetTests.batchIdentifier': batchIdentifier
        });
        
        if (!existingBatch) {
          update.$push = { 
            ...(update.$push || {}),
            bpetTests: bpetUserData.bpetData 
          };
        }
      }



      const pptUserData = pptProcessedData.find(u => u.armyNo === armyNo);
      if (pptUserData) {
        // Check if this batch already exists for this user
        const existingBatch = await db.collection('myusers').findOne({
          armyNo,
          'pptTests.batchIdentifier': batchIdentifier
        });
        
        if (!existingBatch) {
          update.$push = { 
            ...(update.$push || {}),
            pptTests: pptUserData.pptData 
          };
        }
      }
      
      bulkOps.push({
        updateOne: {
          filter: { armyNo },
          update,
          upsert: true
        }
      });
    }
    if (bulkOps.length === 0) {
      await client.close();
      return res.status(400).json({ 
        message: 'No new data to import. All records in the files already exist in the database.', 
        batchnumber,
        testDate,
        batchIdentifier
      });
    }

    // Execute bulk write operation
    const result = await db.collection('myusers').bulkWrite(bulkOps);
    
    await client.close();

    res.status(200).json({
      message: `Data imported successfully for ${uniqueUsers.length} users`,
      count: uniqueUsers.length,
      batchnumber,
      testDate,
      batchIdentifier,
      insertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
      sampleData: allUsers.slice(0, 3),
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