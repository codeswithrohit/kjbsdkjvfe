import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  FiUpload, 
  FiSearch, 
  FiX, 
  FiUser, 
  FiFileText, 
  FiBarChart2, 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiChevronDown, 
  FiChevronRight ,
} from 'react-icons/fi';
import { 
  FaUserAlt, 
  FaRegChartBar,
  FaUser,
  FaIdCard,
  FaStar,
  FaFlask,
  FaBone,
  FaRunning,
  FaMedal,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  
} from 'react-icons/fa';
import { GiBodyBalance } from 'react-icons/gi';
import { MdFitnessCenter, MdScience, MdOutlineSportsScore, MdOutlineAssignment } from 'react-icons/md';
import Select from 'react-select';

const checkBMIStatus = (bmi) => {
  const bmiValue = parseFloat(bmi);
  return bmiValue >= 18.5 && bmiValue <= 26.5 ? 'PASS' : 'FAIL';
};

const checkPBFStatus = (pbf) => {
  const pbfValue = parseFloat(pbf);
  return pbfValue >= 10.0 && pbfValue <= 16.4 ? 'PASS' : 'FAIL';
};

const checkHBStatus = (hb) => {
  const hbValue = parseFloat(hb);
  return hbValue >= 13.8 && hbValue <= 17.2 ? 'PASS' : 'FAIL';
};

// PPT Test Status Checkers
const checkChinUpStatus = (value) => {
  const val = parseInt(value);
  if (val >= 10) return 'EX';
  if (val >= 8) return 'GOOD';
  if (val >= 8) return 'SAT';
  return 'FAIL';
};

const checkSitUpStatus = (value) => {
  const val = parseInt(value);
  if (val >= 40) return 'EX';
  if (val >= 35) return 'GOOD';
  if (val >= 30) return 'SAT';
  return 'FAIL';
};

const checkToeTouchStatus = (value) => {
  const val = parseInt(value);
  if (val >= 8) return 'EX';
  if (val >= 7) return 'GOOD';
  if (val >= 6) return 'SAT';
  return 'FAIL';
};

const checkHundredMtrSprintStatus = (value) => {
  const val = parseInt(value);
  if (val >= 13) return 'EX';
  if (val >= 15) return 'GOOD';
  if (val >= 17) return 'SAT';
  return 'FAIL';
};

const checkTwoPointFourKmRunStatus = (value) => {
  const val = parseInt(value);
  if (val >= 20) return 'EX';
  if (val >= 16) return 'GOOD';
  if (val >= 12) return 'SAT';
  return 'FAIL';
};

const checkFiveMtrShuttleStatus = (value) => {
  const val = parseInt(value);
  if (val >= 17) return 'EX';
  if (val >= 16) return 'GOOD';
  if (val >= 15) return 'SAT';
  return 'FAIL';
};
// Add this helper function near the top with other status checkers
const getBDMStatus = (tScoreStr) => {
  // Extract the numeric value from strings like "(-0.16(103.0%)"
  const match = tScoreStr?.match(/\(?(-?\d+\.\d+)/);
  const tScore = match ? parseFloat(match[1]) : null;
  
  if (tScore === null) return 'NORMAL'; // Default if no valid score
  
  if (tScore >= -1.0) return 'NORMAL';
  if (tScore > -2.5) return 'OSTEOPENIA';
  return 'OSTEOPOROSIS';
};
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [selectedTest, setSelectedTest] = useState([]);
  const [selectedTestField, setSelectedTestField] = useState([]);
  const [selectedTestResult, setSelectedTestResult] = useState([]);
  const [selectedPPTResult, setSelectedPPTResult] = useState([]);
  const [selectedPPTField, setSelectedPPTField] = useState([]);
  const [selectedBCMField, setSelectedBCMField] = useState([]);
  const [selectedBCMResult, setSelectedBCMResult] = useState([]);
  const [selectedBDMField, setSelectedBDMField] = useState([]);
  const [selectedBDMResult, setSelectedBDMResult] = useState([]);

  const router = useRouter();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const batchNumbers = [...new Set(users.map(user => user.batchnumber))].filter(batch => batch);
  const batchOptions = [
    { value: 'all', label: 'All Batches' },
    ...batchNumbers.map(batch => ({ value: batch, label: batch }))
  ];

// console.log("users",users)
  const toggleUserExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };
  const testOptions = [
    { value: 'all', label: 'All Tests' },
    { value: 'bpet', label: 'BPET' },
    { value: 'ppt', label: 'PPT' },
    { value: 'bcm', label: 'BCM' },
    { value: 'bdm', label: 'BDM' }
  ];

  const bpetFieldOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'fivekmrunning', label: '5km Run' },
    { value: 'sixtymsprint', label: '60m Sprint' },
    { value: 'verticalrope', label: 'Vertical Rope' },
    { value: 'horizontalrope', label: 'Horizontal Rope' },
    { value: 'nineftditch', label: '9ft Ditch' },
    { value: 'overall', label: 'Overall' },
    { value: 'result', label: 'Result' }
  ];

  const resultOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'EX', label: 'EX' },
    { value: 'PASS', label: 'PASS' },
    { value: 'FAIL', label: 'FAIL' }
  ];

  const pptFieldOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'chinup', label: 'Chin Up' },
    { value: 'situp', label: 'Sit Up' },
    { value: 'toetouch', label: 'Toe Touch' },
    { value: 'hundredmtrsprint', label: '100m Sprint' },
    { value: 'twopointfourkmrun', label: '2.4km Run' },
    { value: 'result', label: 'Overall Result' }
  ];

  const bcmFieldOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'bmi', label: 'BMI' },
    { value: 'pbf', label: 'PBF' },
    { value: 'hb', label: 'Hb' }
  ];

  const bcmResultOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'PASS', label: 'Normal' },
    { value: 'FAIL', label: 'Abnormal' }
  ];

  const bdmFieldOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'tScore', label: 'T-Score' },
    { value: 'result', label: 'Result' }
  ];

  const bdmResultOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'OSTEOPENIA', label: 'OSTEOPENIA' },
    { value: 'OSTEOPOROSIS', label: 'OSTEOPOROSIS' }
  ];
 
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.armyNo && user.armyNo.toLowerCase().includes(searchLower));
    
    // Batch filter
    const matchesBatch = selectedBatch.length === 0 || 
      selectedBatch.some(b => b.value === 'all') || 
      selectedBatch.some(b => b.value === user.batchnumber);
    
    // Tab filter
    let matchesTab = true;
    if (activeTab === 'all') matchesTab = true;
    else if (activeTab === 'bcm' && user.bcmTests?.length) matchesTab = true;
    else if (activeTab === 'bdm' && user.bdmTests?.length) matchesTab = true;
    else if (activeTab === 'bpet' && user.bpetTests?.length) matchesTab = true;
    else if (activeTab === 'ppt' && user.pptTests?.length) matchesTab = true;
    else matchesTab = false;
    
    // Test type filter
    let matchesTestType = true;
    if (selectedTest.length > 0 && !selectedTest.some(t => t.value === 'all')) {
      matchesTestType = selectedTest.some(test => {
        if (test.value === 'bpet') return user.bpetTests?.length;
        if (test.value === 'ppt') return user.pptTests?.length;
        if (test.value === 'bcm') return user.bcmTests?.length;
        if (test.value === 'bdm') return user.bdmTests?.length;
        return false;
      });
    }
    
    // BPET filters
    let matchesBPETField = true;
    let matchesBPETResult = true;
    if (selectedTest.some(t => t.value === 'bpet') && user.bpetTests?.length) {
      const bpetTest = user.bpetTests[0];
      
      if (selectedTestField.length > 0 && !selectedTestField.some(f => f.value === 'all')) {
        matchesBPETField = selectedTestField.some(field => 
          bpetTest[field.value] !== undefined
        );
        
        if (selectedTestResult.length > 0 && !selectedTestResult.some(r => r.value === 'all')) {
          matchesBPETResult = selectedTestResult.some(result => {
            return selectedTestField.some(field => 
              bpetTest[field.value] === result.value
            );
          });
        }
      } else if (selectedTestResult.length > 0 && !selectedTestResult.some(r => r.value === 'all')) {
        matchesBPETResult = selectedTestResult.some(result => 
          bpetTest.result === result.value
        );
      }
    }
    
    // PPT filters
    let matchesPPTField = true;
    let matchesPPTResult = true;
    if (selectedTest.some(t => t.value === 'ppt') && user.pptTests?.length) {
      const pptTest = user.pptTests[0];
      
      if (selectedPPTField.length > 0 && !selectedPPTField.some(f => f.value === 'all')) {
        matchesPPTField = selectedPPTField.some(field => 
          pptTest[field.value] !== undefined
        );
        
        if (selectedPPTResult.length > 0 && !selectedPPTResult.some(r => r.value === 'all')) {
          matchesPPTResult = selectedPPTResult.some(result => {
            return selectedPPTField.some(field => {
              // Check the status based on the field
              let status;
              switch(field.value) {
                case 'chinup':
                  status = checkChinUpStatus(pptTest.chinup);
                  break;
                case 'situp':
                  status = checkSitUpStatus(pptTest.situp);
                  break;
                case 'toetouch':
                  status = checkToeTouchStatus(pptTest.toetouch);
                  break;
                case 'hundredmtrsprint':
                  status = checkHundredMtrSprintStatus(pptTest.hundredmtrsprint);
                  break;
                case 'twopointfourkmrun':
                  status = checkTwoPointFourKmRunStatus(pptTest.twopointfourkmrun);
                  break;
                case 'fivemtrshuttle':
                  status = checkFiveMtrShuttleStatus(pptTest.fivemtrshuttle);
                  break;
                case 'result':
                  status = pptTest.result;
                  break;
                default:
                  status = pptTest[field.value];
              }
              return status === result.value;
            });
          });
        }
      } else if (selectedPPTResult.length > 0 && !selectedPPTResult.some(r => r.value === 'all')) {
        matchesPPTResult = selectedPPTResult.some(result => 
          pptTest.result === result.value
        );
      }
    }
    
    
    // BCM filters
    let matchesBCMField = true;
    let matchesBCMResult = true;
    if (selectedTest.some(t => t.value === 'bcm') && user.bcmTests?.length) {
      const bcmTest = user.bcmTests[0];
      
      if (selectedBCMField.length > 0 && !selectedBCMField.some(f => f.value === 'all')) {
        matchesBCMField = selectedBCMField.some(field => 
          bcmTest[field.value] !== undefined
        );
        
        if (selectedBCMResult.length > 0 && !selectedBCMResult.some(r => r.value === 'all')) {
          matchesBCMResult = selectedBCMResult.some(result => {
            return selectedBCMField.some(field => {
              if (field.value === 'bmi') {
                const status = checkBMIStatus(bcmTest.bmi);
                return status === result.value;
              } else if (field.value === 'pbf') {
                const status = checkPBFStatus(bcmTest.pbf);
                return status === result.value;
              } else if (field.value === 'hb') {
                const status = checkHBStatus(bcmTest.hb);
                return status === result.value;
              }
              return bcmTest[field.value] === result.value;
            });
          });
        }
      } else if (selectedBCMResult.length > 0 && !selectedBCMResult.some(r => r.value === 'all')) {
        matchesBCMResult = selectedBCMResult.some(result => 
          bcmTest.bodyBalance === result.value
        );
      }
    }
    
    // BDM filters
// In the filteredUsers filter function, update the BDM filters section:
let matchesBDMField = true;
let matchesBDMResult = true;
if (selectedTest.some(t => t.value === 'bdm') && user.bdmTests?.length) {
  const bdmTest = user.bdmTests[0];
  
  if (selectedBDMField.length > 0 && !selectedBDMField.some(f => f.value === 'all')) {
    matchesBDMField = selectedBDMField.some(field => 
      bdmTest[field.value] !== undefined
    );
    
    if (selectedBDMResult.length > 0 && !selectedBDMResult.some(r => r.value === 'all')) {
      matchesBDMResult = selectedBDMResult.some(result => {
        // For tScore field, use the classification
        if (selectedBDMField.some(f => f.value === 'tScore')) {
          const status = getBDMStatus(bdmTest.tScore);
          return status === result.value;
        }
        return bdmTest[field.value] === result.value;
      });
    }
  } else if (selectedBDMResult.length > 0 && !selectedBDMResult.some(r => r.value === 'all')) {
    matchesBDMResult = selectedBDMResult.some(result => {
      const status = getBDMStatus(bdmTest.tScore);
      return status === result.value;
    });
  }
}
    
    return matchesSearch && matchesBatch && matchesTab && matchesTestType && 
           matchesBPETField && matchesBPETResult && matchesPPTField && matchesPPTResult &&
           matchesBCMField && matchesBCMResult && matchesBDMField && matchesBDMResult;
  });


  

  // Rest of the component remains the same...
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-between items-center">
            <span className="font-medium">Error</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <FiX size={20} />
            </button>
          </div>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }
console.log("filtereduser",filteredUsers)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'all' && 'All Records'}
              {activeTab === 'bcm' && 'Body Composition Measurements'}
              {activeTab === 'bdm' && 'Bone Density Measurements'}
              {activeTab === 'bpet' && 'Basic Physical Efficiency Tests'}
              {activeTab === 'ppt' && 'Physical Proficiency Tests'}
            </h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/uploaddata')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FiUpload className="mr-2" />
                Upload New Data
              </button>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  placeholder="Search by Name or Army No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <StatCard 
                title="Total Users" 
                value={users.length} 
                icon={<FiUsers className="text-indigo-500" size={24} />} 
                trend="up"
              />
              <StatCard 
                title="BCM Tests" 
                value={users.filter(u => u.bcmTests?.length).length} 
                icon={<FiFileText className="text-blue-500" size={24} />} 
              />
              <StatCard 
                title="BDM Tests" 
                value={users.filter(u => u.bdmTests?.length).length} 
                icon={<FiFileText className="text-green-500" size={24} />} 
              />
              <StatCard 
                title="BPET Tests" 
                value={users.filter(u => u.bpetTests?.length).length} 
                icon={<FaRegChartBar className="text-purple-500" size={24} />} 
              />
                 <StatCard 
                title="PPT Tests" 
                value={users.filter(u => u.pptTests?.length).length} 
                icon={<FaRegChartBar className="text-purple-500" size={24} />} 
              />
            </div>
            <div className="bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Batch Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Batch Number</label>
                  <Select
                    options={batchOptions}
                    isMulti
                    value={selectedBatch}
                    onChange={setSelectedBatch}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select batches..."
                  />
                </div>

                {/* Test Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Test Type</label>
                  <Select
                    options={testOptions}
                    isMulti
                    value={selectedTest}
                    onChange={(selected) => {
                      setSelectedTest(selected);
                      setSelectedTestField([]);
                      setSelectedTestResult([]);
                      setSelectedPPTField([]);
                      setSelectedPPTResult([]);
                      setSelectedBCMField([]);
                      setSelectedBCMResult([]);
                      setSelectedBDMField([]);
                      setSelectedBDMResult([]);
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select test types..."
                  />
                </div>

                {/* BPET Field Filter */}
                {selectedTest.some(t => t.value === 'bpet') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">BPET Field</label>
                    <Select
                      options={bpetFieldOptions}
                      isMulti
                      value={selectedTestField}
                      onChange={(selected) => {
                        setSelectedTestField(selected);
                        setSelectedTestResult([]);
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select BPET fields..."
                    />
                  </div>
                )}

                {/* BPET Result Filter */}
                {selectedTest.some(t => t.value === 'bpet') && selectedTestField.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">BPET Result</label>
                    <Select
                      options={resultOptions}
                      isMulti
                      value={selectedTestResult}
                      onChange={setSelectedTestResult}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select results..."
                    />
                  </div>
                )}

                {/* PPT Field Filter */}
                {selectedTest.some(t => t.value === 'ppt') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">PPT Field</label>
                    <Select
                      options={pptFieldOptions}
                      isMulti
                      value={selectedPPTField}
                      onChange={(selected) => {
                        setSelectedPPTField(selected);
                        setSelectedPPTResult([]);
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select PPT fields..."
                    />
                  </div>
                )}

                {/* PPT Result Filter */}
                {selectedTest.some(t => t.value === 'ppt') && selectedPPTField.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">PPT Result</label>
                    <Select
                      options={resultOptions}
                      isMulti
                      value={selectedPPTResult}
                      onChange={setSelectedPPTResult}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select results..."
                    />
                  </div>
                )}

                {/* BCM Field Filter */}
                {selectedTest.some(t => t.value === 'bcm') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">BCM Field</label>
                    <Select
                      options={bcmFieldOptions}
                      isMulti
                      value={selectedBCMField}
                      onChange={(selected) => {
                        setSelectedBCMField(selected);
                        setSelectedBCMResult([]);
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select BCM fields..."
                    />
                  </div>
                )}

                {/* BCM Result Filter */}
                {selectedTest.some(t => t.value === 'bcm') && selectedBCMField.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">BCM Result</label>
                    <Select
                      options={bcmResultOptions}
                      isMulti
                      value={selectedBCMResult}
                      onChange={setSelectedBCMResult}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select results..."
                    />
                  </div>
                )}

                {/* BDM Field Filter */}
                {selectedTest.some(t => t.value === 'bdm') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">BDM Field</label>
                    <Select
                      options={bdmFieldOptions}
                      isMulti
                      value={selectedBDMField}
                      onChange={(selected) => {
                        setSelectedBDMField(selected);
                        setSelectedBDMResult([]);
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select BDM fields..."
                    />
                  </div>
                )}

                {/* BDM Result Filter */}
                {selectedTest.some(t => t.value === 'bdm') && selectedBDMField.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">BDM Result</label>
                    <Select
                      options={bdmResultOptions}
                      isMulti
                      value={selectedBDMResult}
                      onChange={setSelectedBDMResult}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select results..."
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Army No.
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tests
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Test Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <>
                          <tr 
                            key={user._id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleUserExpand(user._id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  {/* <FaUserAlt className="text-indigo-600" /> */}
                                  <img src={user.profileimage} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.armyNo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {user.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                {user.bcmTests?.length > 0 && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">BCM</span>
                                )}
                                {user.bdmTests?.length > 0 && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">BDM</span>
                                )}
                                {user.bpetTests?.length > 0 && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">BPET</span>
                                )}
                                {user.pptTests?.length > 0 && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">PPT</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.bcmTests?.[0]?.testdates || 
                               user.bdmTests?.[0]?.testdates || 
                               user.bpetTests?.[0]?.testDate || 
                               user.pptTests?.[0]?.testdates || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleUserExpand(user._id);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                {expandedUser === user._id ? <FiChevronDown /> : <FiChevronRight />}
                              </button>
                           
                            </td>
                          </tr>
                          {expandedUser === user._id && (
                            <tr className="bg-gray-50">
                              <td colSpan="6" className="px-6 py-4">
                                <UserDetails user={user} />
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around items-center h-16 z-10">
        <BottomTabItem 
          icon={<FiHome size={24} />}
          text="Dashboard"
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
        />
        <BottomTabItem 
          icon={<MdScience size={24} />}
          text="BCM"
          active={activeTab === 'bcm'}
          onClick={() => setActiveTab('bcm')}
        />
        <BottomTabItem 
          icon={<FiBarChart2 size={24} />}
          text="BDM"
          active={activeTab === 'bdm'}
          onClick={() => setActiveTab('bdm')}
        />
        <BottomTabItem 
          icon={<MdOutlineSportsScore size={24} />}
          text="BPET"
          active={activeTab === 'bpet'}
          onClick={() => setActiveTab('bpet')}
        />
        <BottomTabItem 
          icon={<MdOutlineAssignment size={24} />}
          text="PPT"
          active={activeTab === 'ppt'}
          onClick={() => setActiveTab('ppt')}
        />
      </div>
    </div>
  );
};

// Rest of the component code (NavItem, StatCard, UserDetails) remains the same...
const BottomTabItem = ({ icon, text, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full ${
        active ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
      } transition-colors`}
    >
      <div className={`${active ? 'text-indigo-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{text}</span>
    </button>
  );
};

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDetails = ({ user }) => {
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      PASS: { color: 'bg-emerald-100 text-emerald-800', icon: <FaCheckCircle className="mr-1" /> },
      FAIL: { color: 'bg-rose-100 text-rose-800', icon: <FaTimesCircle className="mr-1" /> },
      EX: { color: 'bg-indigo-100 text-indigo-800', icon: <FaMedal className="mr-1" /> },
      GOOD: { color: 'bg-blue-100 text-blue-800', icon: <FaMedal className="mr-1" /> },
      SAT: { color: 'bg-yellow-100 text-yellow-800', icon: <FaMedal className="mr-1" /> },
      NORMAL: { color: 'bg-emerald-100 text-emerald-800', icon: <FaCheckCircle className="mr-1" /> },
      ABNORMAL: { color: 'bg-rose-100 text-rose-800', icon: <FaTimesCircle className="mr-1" /> },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: null };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {status}
      </span>
    );
  };


  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
  {/* Profile header with image/icon */}
  <div className="flex flex-col items-center mb-6 relative">
    <div className="relative">
      {user.profileimage ? (
        <img 
          src={user.profileimage} 
          alt="Profile" 
          className="w-48 h-48 rounded-lg border-4 border-white/30 object-cover shadow-md"
        />
      ) : (
        <div className="w-36 h-36 rounded-lg bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-md">
          <FaUser className="text-4xl text-white/80" />
        </div>
      )}
      {/* <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg">
        <FaShieldAlt className="text-white text-lg" />
      </div> */}
    </div>
    
    <div className="mt-4 text-center">
    <div className="text-blue-100 font-medium">{user.armyNo}-{user.rank}</div>
      <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
   
    </div>
  </div>
  

</div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            Basic Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">Army Number</label>
              <p className="text-gray-900 font-medium">{user.armyNo}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">Rank</label>
              <p className="text-gray-900 font-medium">{user.rank}</p>
            </div>
          </div>
        </div>
      </div>

      {/* BCM Tests */}
      {user.bcmTests?.length > 0 && (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FaFlask className="mr-2 text-blue-600" />
        Body Composition Measurements
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PBF</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Weight</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight Control</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fat Control</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Muscle Control</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hb</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <GiBodyBalance className="mr-1" />
                Balance
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {user.bcmTests.map((test, index) => {
            const bmiStatus = checkBMIStatus(test.bmi);
            const pbfStatus = checkPBFStatus(test.pbf);
            const hbStatus = checkHBStatus(test.hb);
            
            return (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.testdates}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.height}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.weight}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  bmiStatus === 'PASS' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {test.bmi}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={bmiStatus} />
                </td> */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  pbfStatus === 'PASS' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {test.pbf}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={pbfStatus} />
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.targetWeight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.weightControl}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.bfmControl}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.ffmControl}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  hbStatus === 'PASS' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {test.hb}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={hbStatus} />
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.bodyBalance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* BDM Tests */}
    
{user.bdmTests?.length > 0 && (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FaBone className="mr-2 text-blue-600" />
        Bone Density Measurements
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T-Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {user.bdmTests.map((test, index) => {
            // Extract numeric T-Score value
            const tScoreMatch = test.tScore?.match(/\(?(-?\d+\.\d+)/);
            const tScoreValue = tScoreMatch ? parseFloat(tScoreMatch[1]) : null;
            const tScoreDisplay = tScoreValue !== null ? tScoreValue.toFixed(2) : '-';
            
            // Get classification
            const bdmStatus = getBDMStatus(test.tScore);
            
            return (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.testdates}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.tScore} </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={bdmStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.remarks || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* BPET Tests */}
      {user.bpetTests?.length > 0 && (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FaRunning className="mr-2 text-blue-600" />
        Basic Physical Efficiency Tests
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">5km Run</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">60m Sprint</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vertical Rope</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horizontal Rope</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">9ft Ditch</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {user.bpetTests.map((test, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.testDate}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                test.fivekmrunning === 'EX' ? 'text-blue-600' : 
                test.fivekmrunning === 'PASS' ? 'text-green-600' : 
                test.fivekmrunning === 'FAIL' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {test.fivekmrunning}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                test.sixtymsprint === 'EX' ? 'text-blue-600' : 
                test.sixtymsprint === 'PASS' ? 'text-green-600' : 
                test.sixtymsprint === 'FAIL' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {test.sixtymsprint}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                test.verticalrope === 'EX' ? 'text-blue-600' : 
                test.verticalrope === 'PASS' ? 'text-green-600' : 
                test.verticalrope === 'FAIL' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {test.verticalrope}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                test.horizontalrope === 'EX' ? 'text-blue-600' : 
                test.horizontalrope === 'PASS' ? 'text-green-600' : 
                test.horizontalrope === 'FAIL' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {test.horizontalrope}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                test.nineftditch === 'EX' ? 'text-blue-600' : 
                test.nineftditch === 'PASS' ? 'text-green-600' : 
                test.nineftditch === 'FAIL' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {test.nineftditch}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={test.result} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* PPT Tests */}
      {user.pptTests?.length > 0 && (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <MdFitnessCenter className="mr-2 text-blue-600" />
        Physical Proficiency Tests
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chin Up</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sit Up</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toe Touch</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">100m Sprint</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2.4km Run</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">5m Shuttle</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {user.pptTests.map((test, index) => {
            const chinUpStatus = checkChinUpStatus(test.chinup);
            const sitUpStatus = checkSitUpStatus(test.situp);
            const toeTouchStatus = checkToeTouchStatus(test.toetouch);
            const sprintStatus = checkHundredMtrSprintStatus(test.hundredmtrsprint);
            const runStatus = checkTwoPointFourKmRunStatus(test.twopointfourkmrun);
            const shuttleStatus = checkFiveMtrShuttleStatus(test.fivemtrshuttle);
            
            return (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.testdates}</td>
                
                {/* Chin Up */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  chinUpStatus === 'EX' ? 'text-blue-600' : 
                  chinUpStatus === 'PASS' ? 'text-green-600' : 
                  chinUpStatus === 'FAIL' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {test.chinup}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={chinUpStatus} />
                </td> */}
                
                {/* Sit Up */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  sitUpStatus === 'EX' ? 'text-blue-600' : 
                  sitUpStatus === 'PASS' ? 'text-green-600' : 
                  sitUpStatus === 'FAIL' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {test.situp}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={sitUpStatus} />
                </td>
                 */}
                {/* Toe Touch */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  toeTouchStatus === 'EX' ? 'text-blue-600' : 
                  toeTouchStatus === 'PASS' ? 'text-green-600' : 
                  toeTouchStatus === 'FAIL' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {test.toetouch}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={toeTouchStatus} />
                </td> */}
                
                {/* 100m Sprint */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  sprintStatus === 'EX' ? 'text-blue-600' : 
                  sprintStatus === 'PASS' ? 'text-green-600' : 
                  sprintStatus === 'FAIL' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {test.hundredmtrsprint}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={sprintStatus} />
                </td> */}
                
                {/* 2.4km Run */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  runStatus === 'EX' ? 'text-blue-600' : 
                  runStatus === 'PASS' ? 'text-green-600' : 
                  runStatus === 'FAIL' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {test.twopointfourkmrun}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={runStatus} />
                </td> */}
                
                {/* 5m Shuttle */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  shuttleStatus === 'EX' ? 'text-blue-600' : 
                  shuttleStatus === 'PASS' ? 'text-green-600' : 
                  shuttleStatus === 'FAIL' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {test.fivemtrshuttle}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={shuttleStatus} />
                </td>
                 */}
                {/* Result */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={test.result} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;