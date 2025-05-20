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
  FiChevronRight,
  FiFilter,
  FiPieChart,
  FiList,
  FiChevronLeft,
  FiDatabase
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
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

      // First, define your color constants
      const colors = {
        primary: '#4C5D34', // Soldier Green
        primaryLight: '#5B7742', // Fern Green
        secondary: '#2B411C', // Black Leather Jacket
        accent: '#A4AA88', // Grullo
        background: '#F5F5F0',
        card: '#FFFFFF',
        text: '#2B411C',
        textSecondary: '#5B7742',
        light: '#E0E0D8',
        dark: '#1E2A12',
        success: '#4C5D34',
        warning: '#A4AA88',
        danger: '#D32F2F',
        info: '#1976D2'
      };
      
      // Linear gradient background style
      const gradientStyle = {
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      };

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

const getBDMStatus = (tScoreStr) => {
  const match = tScoreStr?.match(/\(?(-?\d+\.\d+)/);
  const tScore = match ? parseFloat(match[1]) : null;
  
  if (tScore === null) return 'NORMAL';
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
  const [selectedChartField, setSelectedChartField] = useState(null);
  const [selectedChartResult, setSelectedChartResult] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'chart'

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

  // Generate chart data based on filtered users and selected test type
  const generateChartData = () => {
    if (!selectedTest.length || selectedTest.some(t => t.value === 'all')) {
      return null;
    }

    const testType = selectedTest[0].value;
    let fields = [];
    let data = {};

    if (testType === 'bpet') {
      fields = bpetFieldOptions.filter(f => f.value !== 'all' && f.value !== 'result');
      data = fields.map(field => {
        const counts = {
          EX: 0,
          PASS: 0,
          FAIL: 0
        };

        filteredUsers.forEach(user => {
          if (user.bpetTests?.length) {
            const value = user.bpetTests[0][field.value];
            if (value === 'EX') counts.EX++;
            else if (value === 'PASS') counts.PASS++;
            else if (value === 'FAIL') counts.FAIL++;
          }
        });

        return {
          field: field.label,
          ...counts
        };
      });
    } else if (testType === 'ppt') {
      fields = pptFieldOptions.filter(f => f.value !== 'all' && f.value !== 'result');
      data = fields.map(field => {
        const counts = {
          EX: 0,
          GOOD: 0,
          SAT: 0,
          FAIL: 0
        };

        filteredUsers.forEach(user => {
          if (user.pptTests?.length) {
            const test = user.pptTests[0];
            let status;
            switch(field.value) {
              case 'chinup':
                status = checkChinUpStatus(test.chinup);
                break;
              case 'situp':
                status = checkSitUpStatus(test.situp);
                break;
              case 'toetouch':
                status = checkToeTouchStatus(test.toetouch);
                break;
              case 'hundredmtrsprint':
                status = checkHundredMtrSprintStatus(test.hundredmtrsprint);
                break;
              case 'twopointfourkmrun':
                status = checkTwoPointFourKmRunStatus(test.twopointfourkmrun);
                break;
              case 'fivemtrshuttle':
                status = checkFiveMtrShuttleStatus(test.fivemtrshuttle);
                break;
              default:
                status = test[field.value];
            }
            if (status === 'EX') counts.EX++;
            else if (status === 'GOOD') counts.GOOD++;
            else if (status === 'SAT') counts.SAT++;
            else if (status === 'FAIL') counts.FAIL++;
          }
        });

        return {
          field: field.label,
          ...counts
        };
      });
    } else if (testType === 'bcm') {
      fields = bcmFieldOptions.filter(f => f.value !== 'all');
      data = fields.map(field => {
        const counts = {
          PASS: 0,
          FAIL: 0
        };

        filteredUsers.forEach(user => {
          if (user.bcmTests?.length) {
            const test = user.bcmTests[0];
            let status;
            if (field.value === 'bmi') {
              status = checkBMIStatus(test.bmi);
            } else if (field.value === 'pbf') {
              status = checkPBFStatus(test.pbf);
            } else if (field.value === 'hb') {
              status = checkHBStatus(test.hb);
            } else {
              status = test[field.value];
            }
            if (status === 'PASS') counts.PASS++;
            else if (status === 'FAIL') counts.FAIL++;
          }
        });

        return {
          field: field.label,
          ...counts
        };
      });
    } else if (testType === 'bdm') {
      fields = bdmFieldOptions.filter(f => f.value !== 'all' && f.value !== 'result');
      data = fields.map(field => {
        const counts = {
          NORMAL: 0,
          OSTEOPENIA: 0,
          OSTEOPOROSIS: 0
        };

        filteredUsers.forEach(user => {
          if (user.bdmTests?.length) {
            const test = user.bdmTests[0];
            let status;
            if (field.value === 'tScore') {
              status = getBDMStatus(test.tScore);
            } else {
              status = test[field.value];
            }
            if (status === 'NORMAL') counts.NORMAL++;
            else if (status === 'OSTEOPENIA') counts.OSTEOPENIA++;
            else if (status === 'OSTEOPOROSIS') counts.OSTEOPOROSIS++;
          }
        });

        return {
          field: field.label,
          ...counts
        };
      });
    }

    return {
      labels: data.map(item => item.field),
      datasets: testType === 'bpet' ? [
        {
          label: 'EX',
          data: data.map(item => item.EX),
          backgroundColor: colors.success,
          borderColor: colors.success,
          borderWidth: 1,
        },
        {
          label: 'PASS',
          data: data.map(item => item.PASS),
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        },
        {
          label: 'FAIL',
          data: data.map(item => item.FAIL),
          backgroundColor: colors.danger,
          borderColor: colors.danger,
          borderWidth: 1,
        }
      ] : testType === 'ppt' ? [
        {
          label: 'EX',
          data: data.map(item => item.EX),
          backgroundColor: colors.success,
          borderColor: colors.success,
          borderWidth: 1,
        },
        {
          label: 'GOOD',
          data: data.map(item => item.GOOD),
          backgroundColor: '#8BC34A',
          borderColor: '#8BC34A',
          borderWidth: 1,
        },
        {
          label: 'SAT',
          data: data.map(item => item.SAT),
          backgroundColor: colors.warning,
          borderColor: colors.warning,
          borderWidth: 1,
        },
        {
          label: 'FAIL',
          data: data.map(item => item.FAIL),
          backgroundColor: colors.danger,
          borderColor: colors.danger,
          borderWidth: 1,
        }
      ] : testType === 'bcm' ? [
        {
          label: 'PASS',
          data: data.map(item => item.PASS),
          backgroundColor: colors.success,
          borderColor: colors.success,
          borderWidth: 1,
        },
        {
          label: 'FAIL',
          data: data.map(item => item.FAIL),
          backgroundColor: colors.danger,
          borderColor: colors.danger,
          borderWidth: 1,
        }
      ] : [
        {
          label: 'NORMAL',
          data: data.map(item => item.NORMAL),
          backgroundColor: colors.success,
          borderColor: colors.success,
          borderWidth: 1,
        },
        {
          label: 'OSTEOPENIA',
          data: data.map(item => item.OSTEOPENIA),
          backgroundColor: colors.warning,
          borderColor: colors.warning,
          borderWidth: 1,
        },
        {
          label: 'OSTEOPOROSIS',
          data: data.map(item => item.OSTEOPOROSIS),
          backgroundColor: colors.danger,
          borderColor: colors.danger,
          borderWidth: 1,
        }
      ]
    };
  };

  // Generate summary data for the cards
  const generateSummaryData = () => {
    if (!selectedTest.length || selectedTest.some(t => t.value === 'all')) {
      return null;
    }

    const testType = selectedTest[0].value;
    const totalUsers = filteredUsers.length;
    
    if (testType === 'bpet') {
      const passed = filteredUsers.filter(u => u.bpetTests?.[0]?.result === 'PASS' || u.bpetTests?.[0]?.result === 'EX').length;
      const failed = filteredUsers.filter(u => u.bpetTests?.[0]?.result === 'FAIL').length;
      return {
        total: totalUsers,
        passed,
        failed,
        passRate: totalUsers > 0 ? Math.round((passed / totalUsers) * 100) : 0
      };
    } else if (testType === 'ppt') {
      const excellent = filteredUsers.filter(u => u.pptTests?.[0]?.result === 'EX').length;
      const good = filteredUsers.filter(u => u.pptTests?.[0]?.result === 'GOOD').length;
      const satisfactory = filteredUsers.filter(u => u.pptTests?.[0]?.result === 'SAT').length;
      const failed = filteredUsers.filter(u => u.pptTests?.[0]?.result === 'FAIL').length;
      return {
        total: totalUsers,
        excellent,
        good,
        satisfactory,
        failed,
        passRate: totalUsers > 0 ? Math.round(((excellent + good + satisfactory) / totalUsers) * 100) : 0
      };
    } else if (testType === 'bcm') {
      const passedBMI = filteredUsers.filter(u => checkBMIStatus(u.bcmTests?.[0]?.bmi) === 'PASS').length;
      const passedPBF = filteredUsers.filter(u => checkPBFStatus(u.bcmTests?.[0]?.pbf) === 'PASS').length;
      const passedHB = filteredUsers.filter(u => checkHBStatus(u.bcmTests?.[0]?.hb) === 'PASS').length;
      return {
        total: totalUsers,
        passedBMI,
        passedPBF,
        passedHB,
        bmiRate: totalUsers > 0 ? Math.round((passedBMI / totalUsers) * 100) : 0,
        pbfRate: totalUsers > 0 ? Math.round((passedPBF / totalUsers) * 100) : 0,
        hbRate: totalUsers > 0 ? Math.round((passedHB / totalUsers) * 100) : 0
      };
    } else if (testType === 'bdm') {
      const normal = filteredUsers.filter(u => getBDMStatus(u.bdmTests?.[0]?.tScore) === 'NORMAL').length;
      const osteopenia = filteredUsers.filter(u => getBDMStatus(u.bdmTests?.[0]?.tScore) === 'OSTEOPENIA').length;
      const osteoporosis = filteredUsers.filter(u => getBDMStatus(u.bdmTests?.[0]?.tScore) === 'OSTEOPOROSIS').length;
      return {
        total: totalUsers,
        normal,
        osteopenia,
        osteoporosis,
        normalRate: totalUsers > 0 ? Math.round((normal / totalUsers) * 100) : 0
      };
    }
    
    return null;
  };

  const chartData = generateChartData();
  const summaryData = generateSummaryData();

  // Get users filtered by chart selection
  const getUsersByChartSelection = () => {
    if (!selectedChartField || !selectedChartResult) return filteredUsers;

    const testType = selectedTest[0].value;
    
    return filteredUsers.filter(user => {
      if (testType === 'bpet' && user.bpetTests?.length) {
        const test = user.bpetTests[0];
        return test[selectedChartField] === selectedChartResult;
      } else if (testType === 'ppt' && user.pptTests?.length) {
        const test = user.pptTests[0];
        let status;
        switch(selectedChartField) {
          case 'chinup':
            status = checkChinUpStatus(test.chinup);
            break;
          case 'situp':
            status = checkSitUpStatus(test.situp);
            break;
          case 'toetouch':
            status = checkToeTouchStatus(test.toetouch);
            break;
          case 'hundredmtrsprint':
            status = checkHundredMtrSprintStatus(test.hundredmtrsprint);
            break;
          case 'twopointfourkmrun':
            status = checkTwoPointFourKmRunStatus(test.twopointfourkmrun);
            break;
          case 'fivemtrshuttle':
            status = checkFiveMtrShuttleStatus(test.fivemtrshuttle);
            break;
          default:
            status = test[selectedChartField];
        }
        return status === selectedChartResult;
      } else if (testType === 'bcm' && user.bcmTests?.length) {
        const test = user.bcmTests[0];
        let status;
        if (selectedChartField === 'bmi') {
          status = checkBMIStatus(test.bmi);
        } else if (selectedChartField === 'pbf') {
          status = checkPBFStatus(test.pbf);
        } else if (selectedChartField === 'hb') {
          status = checkHBStatus(test.hb);
        } else {
          status = test[selectedChartField];
        }
        return status === selectedChartResult;
      } else if (testType === 'bdm' && user.bdmTests?.length) {
        const test = user.bdmTests[0];
        let status;
        if (selectedChartField === 'tScore') {
          status = getBDMStatus(test.tScore);
        } else {
          status = test[selectedChartField];
        }
        return status === selectedChartResult;
      }
      return false;
    });
  };

  const chartSelectedUsers = getUsersByChartSelection();
  const toggleUserExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };
  const handleChartClick = (field, result) => {
    setSelectedChartField(field);
    setSelectedChartResult(result);
    setViewMode('list');
  };

  const resetChartSelection = () => {
    setSelectedChartField(null);
    setSelectedChartResult(null);
    setViewMode('chart');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors.background }}>
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

  return (
    <div className="flex flex-col min-h-screen mb-20" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
  <div className="max-w-7xl mx-auto py-2 md:py-4 px-3 sm:px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
    <h1 className="text-xs sm:text-xl font-bold w-full sm:w-auto text-center sm:text-left" style={{ color: colors.text }}>
      {activeTab === 'all' && 'Medical Reports'}
      {activeTab === 'bcm' && 'Body Composition Measurements'}
      {activeTab === 'bdm' && 'Bone Density Measurements'}
      {activeTab === 'bpet' && 'Basic Physical Efficiency Tests'}
      {activeTab === 'ppt' && 'Physical Proficiency Tests'}
    </h1>
    <div className="flex flex-col xs:flex-row items-stretch xs:items-center w-full sm:w-auto gap-2 sm:gap-4">
      <button 
        onClick={() => router.push('/uploaddata')}
        className="inline-flex items-center justify-center px-2 py-2 w-full xs:w-20 border border-transparent text-xs font-bold rounded-md shadow-sm text-white"
        style={{ backgroundColor: colors.primary, hoverBackgroundColor: colors.primaryDark }}
      >
        <FiUpload className="mr-1 sm:mr-2 text-lg sm:text-xl" />
        <span className="sm:block">Upload</span>
      </button>
      <div className="relative flex-grow xs:flex-grow-0 xs:w-48 md:w-56 lg:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: colors.textSecondary }} />
        </div>
        <input
          type="text"
          className="block w-full pl-8 sm:pl-10 pr-3 py-1 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 text-xs sm:text-sm transition-colors"
          style={{ 
            borderColor: colors.light,
            focusRingColor: colors.primary,
            placeholderColor: colors.textSecondary
          }}
          placeholder="Search by Name or Army No..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  </div>
</header>

      {/* Content */}


<main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: colors.background }}>
  <div className="max-w-7xl mx-auto">
    {/* Filters Card - Redesigned with military aesthetic */}
    <div 
      className="p-6 mb-6 rounded-lg shadow-md border"
      style={{ 
        backgroundColor: colors.card,
        borderColor: colors.light,
        boxShadow: '0 2px 8px rgba(43, 65, 28, 0.1)'
      }}
    >
      <h3 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: colors.secondary }}>
        <FiFilter className="inline mr-2" />
        Filter Records
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Batch Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.secondary }}>
            Batch Number
          </label>
          <Select
            options={batchOptions}
            isMulti
            value={selectedBatch}
            onChange={setSelectedBatch}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select batches..."
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? colors.primary : colors.light,
                borderWidth: '1px',
                borderRadius: '6px',
                boxShadow: state.isFocused ? `0 0 0 1px ${colors.primary}` : 'none',
                '&:hover': {
                  borderColor: colors.primaryLight
                }
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? colors.primary : 
                                  state.isFocused ? colors.accent : 'white',
                color: state.isSelected ? 'white' : colors.text,
                '&:active': {
                  backgroundColor: colors.primaryLight
                }
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: colors.accent
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: colors.text
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: colors.text,
                ':hover': {
                  backgroundColor: colors.primary,
                  color: 'white'
                }
              })
            }}
          />
        </div>

        {/* Test Type Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.secondary }}>
            Test Type
          </label>
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
              setSelectedChartField(null);
              setSelectedChartResult(null);
              setViewMode('chart');
            }}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select test types..."
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? colors.primary : colors.light,
                borderWidth: '1px',
                borderRadius: '6px',
                boxShadow: state.isFocused ? `0 0 0 1px ${colors.primary}` : 'none',
                '&:hover': {
                  borderColor: colors.primaryLight
                }
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? colors.primary : 
                                  state.isFocused ? colors.accent : 'white',
                color: state.isSelected ? 'white' : colors.text,
                '&:active': {
                  backgroundColor: colors.primaryLight
                }
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: colors.accent
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: colors.text
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: colors.text,
                ':hover': {
                  backgroundColor: colors.primary,
                  color: 'white'
                }
              })
            }}
          />
        </div>

        {/* View Mode Toggle */}
        {selectedTest.length > 0 && !selectedTest.some(t => t.value === 'all') && (
          <div className="flex items-center space-x-4 self-end">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded-md flex items-center transition-all ${viewMode === 'chart' ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`}
              style={{ 
                backgroundColor: viewMode === 'chart' ? colors.primary : undefined,
                border: viewMode !== 'chart' ? `1px solid ${colors.light}` : 'none'
              }}
            >
              <FiPieChart className="mr-2" />
              Chart View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md flex items-center transition-all ${viewMode === 'list' ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`}
              style={{ 
                backgroundColor: viewMode === 'list' ? colors.primary : undefined,
                border: viewMode !== 'list' ? `1px solid ${colors.light}` : 'none'
              }}
            >
              <FiList className="mr-2" />
              List View
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Chart View */}
    {viewMode === 'chart' && chartData && (
      <div 
        className="p-6 mb-6 rounded-lg shadow-md border"
        style={{ 
          backgroundColor: colors.card,
          borderColor: colors.light,
          boxShadow: '0 2px 8px rgba(43, 65, 28, 0.1)'
        }}
      >
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wider" style={{ color: colors.secondary }}>
          <FiBarChart2 className="inline mr-2" />
          Test Results Distribution
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-white p-4 rounded border" style={{ borderColor: colors.light }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: colors.textSecondary
                    }
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                      color: colors.light
                    },
                    ticks: {
                      color: colors.textSecondary
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: colors.text,
                      font: {
                        weight: 'bold'
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: colors.dark,
                    titleColor: colors.light,
                    bodyColor: colors.light,
                    borderColor: colors.primary,
                    borderWidth: 1,
                    titleFont: {
                      weight: 'bold'
                    }
                  }
                },
                onClick: (event, elements) => {
                  if (elements.length > 0) {
                    const datasetIndex = elements[0].datasetIndex;
                    const fieldIndex = elements[0].index;
                    const field = chartData.labels[fieldIndex];
                    const result = chartData.datasets[datasetIndex].label;
                    
                    // Find the original field name from options
                    let fieldName = '';
                    if (selectedTest[0].value === 'bpet') {
                      fieldName = bpetFieldOptions.find(f => f.label === field)?.value;
                    } else if (selectedTest[0].value === 'ppt') {
                      fieldName = pptFieldOptions.find(f => f.label === field)?.value;
                    } else if (selectedTest[0].value === 'bcm') {
                      fieldName = bcmFieldOptions.find(f => f.label === field)?.value;
                    } else if (selectedTest[0].value === 'bdm') {
                      fieldName = bdmFieldOptions.find(f => f.label === field)?.value;
                    }
                    
                    if (fieldName) {
                      handleChartClick(fieldName, result);
                    }
                  }
                }
              }}
            />
          </div>
          <div className="h-96 bg-white p-4 rounded border" style={{ borderColor: colors.light }}>
            <Doughnut
              data={{
                labels: chartData.labels,
                datasets: [{
                  data: chartData.labels.map((label, i) => {
                    return chartData.datasets.reduce((sum, dataset) => sum + dataset.data[i], 0);
                  }),
                  backgroundColor: [
                    colors.primary,
                    colors.primaryLight,
                    colors.accent,
                    colors.secondary,
                    '#8BC34A',
                    '#9C27B0',
                    '#607D8B'
                  ],
                  borderColor: colors.card,
                  borderWidth: 2
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: colors.text,
                      font: {
                        weight: 'bold'
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: colors.dark,
                    titleColor: colors.light,
                    bodyColor: colors.light,
                    borderColor: colors.primary,
                    borderWidth: 1,
                    titleFont: {
                      weight: 'bold'
                    }
                  }
                },
                onClick: (event, elements) => {
                  if (elements.length > 0) {
                    const fieldIndex = elements[0].index;
                    const field = chartData.labels[fieldIndex];
                    
                    // Find the original field name from options
                    let fieldName = '';
                    if (selectedTest[0].value === 'bpet') {
                      fieldName = bpetFieldOptions.find(f => f.label === field)?.value;
                    } else if (selectedTest[0].value === 'ppt') {
                      fieldName = pptFieldOptions.find(f => f.label === field)?.value;
                    } else if (selectedTest[0].value === 'bcm') {
                      fieldName = bcmFieldOptions.find(f => f.label === field)?.value;
                    } else if (selectedTest[0].value === 'bdm') {
                      fieldName = bdmFieldOptions.find(f => f.label === field)?.value;
                    }
                    
                    if (fieldName) {
                      setSelectedChartField(fieldName);
                      setViewMode('list');
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    )}

    {/* List View */}
    {viewMode === 'list' && (
      <div 
        className="p-6 rounded-lg shadow-md border"
        style={{ 
          backgroundColor: colors.card,
          borderColor: colors.light,
          boxShadow: '0 2px 8px rgba(43, 65, 28, 0.1)'
        }}
      >
        {selectedChartField && selectedChartResult ? (
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>
                <FiUsers className="inline mr-2" />
                Showing {chartSelectedUsers.length} users with {selectedChartResult} in {selectedChartField}
              </h2>
              <button 
                onClick={resetChartSelection}
                className="text-sm flex items-center font-semibold px-3 py-1 rounded hover:bg-gray-100 transition-all"
                style={{ color: colors.primary }}
              >
                <FiChevronLeft className="mr-1" />
                Back to all results
              </button>
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ color: colors.secondary }}>
            <FiDatabase className="inline mr-2" />
            {filteredUsers.length} {filteredUsers.length === 1 ? 'Record' : 'Records'} Found
          </h2>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: colors.light }}>
            <thead>
              <tr style={{ backgroundColor: colors.accent }}>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Army No</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Batch</th>
                {selectedTest.some(t => t.value === 'bpet') && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>5km Run</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>60m Sprint</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Vertical Rope</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Horizontal Rope</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>9ft Ditch</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Overall</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Result</th>
                  </>
                )}
                {selectedTest.some(t => t.value === 'ppt') && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Chin Up</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Sit Up</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Toe Touch</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>100m Sprint</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>2.4km Run</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Result</th>
                  </>
                )}
                {selectedTest.some(t => t.value === 'bcm') && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>BMI</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>PBF</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Hb</th>
                  </>
                )}
                {selectedTest.some(t => t.value === 'bdm') && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>T-Score</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Result</th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.secondary }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.light }}>
              {(selectedChartField && selectedChartResult ? chartSelectedUsers : filteredUsers).map((user, index) => (
                <>
                  <tr 
                    key={user._id} 
                    onClick={() => toggleUserExpand(user._id)} 
                    className={`hover:bg-opacity-50 transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    style={{ backgroundColor: index % 2 === 0 ? colors.card : colors.background }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 flex flex-row h-10 w-10">
                        {index+1}.  {user.profileimage ? (
                            <img className="h-10 w-10 rounded-full border" style={{ borderColor: colors.light }} src={user.profileimage} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                              <FiUser className="h-5 w-5" style={{ color: colors.secondary }} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold" style={{ color: colors.text }}>{user.name}</div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>{user.rank}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.text }}>{user.armyNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.text }}>
                      <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: colors.accent, color: colors.secondary }}>
                        {user.batchnumber}
                      </span>
                    </td>
                    
                    {/* BPET Test Results */}
                    {selectedTest.some(t => t.value === 'bpet') && user.bpetTests?.length > 0 && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bpetTests[0].fivekmrunning} 
                            showText={!selectedChartField || selectedChartField === 'fivekmrunning'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bpetTests[0].sixtymsprint} 
                            showText={!selectedChartField || selectedChartField === 'sixtymsprint'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bpetTests[0].verticalrope} 
                            showText={!selectedChartField || selectedChartField === 'verticalrope'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bpetTests[0].horizontalrope} 
                            showText={!selectedChartField || selectedChartField === 'horizontalrope'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bpetTests[0].nineftditch} 
                            showText={!selectedChartField || selectedChartField === 'nineftditch'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bpetTests[0].overall} 
                            showText={!selectedChartField || selectedChartField === 'overall'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bpetTests[0].result} 
                            showText={!selectedChartField || selectedChartField === 'result'}
                            colors={colors}
                          />
                        </td>
                      </>
                    )}
                    
                    {/* PPT Test Results */}
                    {selectedTest.some(t => t.value === 'ppt') && user.pptTests?.length > 0 && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkChinUpStatus(user.pptTests[0].chinup)} 
                            value={user.pptTests[0].chinup}
                            showText={!selectedChartField || selectedChartField === 'chinup'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkSitUpStatus(user.pptTests[0].situp)} 
                            value={user.pptTests[0].situp}
                            showText={!selectedChartField || selectedChartField === 'situp'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkToeTouchStatus(user.pptTests[0].toetouch)} 
                            value={user.pptTests[0].toetouch}
                            showText={!selectedChartField || selectedChartField === 'toetouch'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkHundredMtrSprintStatus(user.pptTests[0].hundredmtrsprint)} 
                            value={user.pptTests[0].hundredmtrsprint}
                            showText={!selectedChartField || selectedChartField === 'hundredmtrsprint'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkTwoPointFourKmRunStatus(user.pptTests[0].twopointfourkmrun)} 
                            value={user.pptTests[0].twopointfourkmrun}
                            showText={!selectedChartField || selectedChartField === 'twopointfourkmrun'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.pptTests[0].result} 
                            showText={!selectedChartField || selectedChartField === 'result'}
                            colors={colors}
                          />
                        </td>
                      </>
                    )}
                    
                    {/* BCM Test Results */}
                    {selectedTest.some(t => t.value === 'bcm') && user.bcmTests?.length > 0 && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkBMIStatus(user.bcmTests[0].bmi)} 
                            value={user.bcmTests[0].bmi}
                            showText={!selectedChartField || selectedChartField === 'bmi'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkPBFStatus(user.bcmTests[0].pbf)} 
                            value={user.bcmTests[0].pbf}
                            showText={!selectedChartField || selectedChartField === 'pbf'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={checkHBStatus(user.bcmTests[0].hb)} 
                            value={user.bcmTests[0].hb}
                            showText={!selectedChartField || selectedChartField === 'hb'}
                            colors={colors}
                          />
                        </td>
                      </>
                    )}
                    
                    {/* BDM Test Results */}
                    {selectedTest.some(t => t.value === 'bdm') && user.bdmTests?.length > 0 && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={getBDMStatus(user.bdmTests[0].tScore)} 
                            value={user.bdmTests[0].tScore}
                            showText={!selectedChartField || selectedChartField === 'tScore'}
                            colors={colors}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={user.bdmTests[0].result} 
                            showText={!selectedChartField || selectedChartField === 'result'}
                            colors={colors}
                          />
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserExpand(user._id);
                        }}
                        className="p-1 rounded-full flex flex-row font-bold hover:bg-gray-100 transition-all"
                        style={{ color: colors.primary }}
                      > View Details
                        {expandedUser === user._id ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedUser === user._id && (
                    <tr className="bg-gray-50">
                      <td 
                        colSpan={selectedTest.some(t => t.value === 'bpet') ? 11 : 
                            selectedTest.some(t => t.value === 'ppt') ? 9 : 
                            selectedTest.some(t => t.value === 'bcm') ? 6 : 
                            selectedTest.some(t => t.value === 'bdm') ? 5 : 3} 
                            className="px-6 py-4"
                            style={{ backgroundColor: colors.background }}
                      >
                        <UserDetails user={user} colors={colors} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
</main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around items-center h-16 z-10">
        <BottomTabItem 
          icon={<FiHome size={24} />}
          text="Dashboard"
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
        />
        {/* <BottomTabItem 
          icon={<MdScience size={24} />}
          text="BCM"
          active={activeTab === 'bcm'}
          onClick={() => setActiveTab('bcm')}
        />
        <BottomTabItem 
          icon={<FaBone size={24} />}
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
        /> */}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, value, showText = true }) => {
  let bgColor = colors.light;
  let textColor = colors.text;
  let borderColor = 'transparent';
  
  if (status === 'EX' || status === 'PASS' || status === 'NORMAL') {
    bgColor = colors.success + '20'; // Add opacity
    textColor = colors.success;
    borderColor = colors.success;
  } else if (status === 'GOOD') {
    bgColor = colors.primary + '20';
    textColor = colors.primary;
    borderColor = colors.primary;
  } else if (status === 'SAT' || status === 'OSTEOPENIA') {
    bgColor = colors.warning + '20';
    textColor = colors.warning;
    borderColor = colors.warning;
  } else if (status === 'FAIL' || status === 'OSTEOPOROSIS') {
    bgColor = colors.danger + '20';
    textColor = colors.danger;
    borderColor = colors.danger;
  }

  return (
    <span 
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border`}
      style={{ 
        backgroundColor: bgColor,
        color: textColor,
        borderColor: borderColor
      }}
    >
      {showText ? (value ? `${value} (${status})` : status) : ''}
    </span>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, percentage, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{title}</p>
          <p className="text-2xl font-semibold mt-1" style={{ color: colors.text }}>{value}</p>
          {percentage !== undefined && (
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {percentage}% of total
            </p>
          )}
        </div>
        <div 
          className="p-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color + '20', color: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// Bottom Tab Item Component
const BottomTabItem = ({ icon, text, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
        active ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
      }`}
    >
      <div className={`${active ? 'text-indigo-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{text}</span>
    </button>
  );
};
const UserDetails = ({ user }) => {
  // Status badge component with new color scheme
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      PASS: { color: 'bg-[#5B7742]/20 text-[#5B7742]', icon: <FaCheckCircle className="mr-1" /> },
      FAIL: { color: 'bg-[#A4AA88]/20 text-[#2B411C]', icon: <FaTimesCircle className="mr-1" /> },
      EX: { color: 'bg-[#4C5D34]/20 text-[#4C5D34]', icon: <FaMedal className="mr-1" /> },
      GOOD: { color: 'bg-[#4C5D34]/20 text-[#4C5D34]', icon: <FaMedal className="mr-1" /> },
      SAT: { color: 'bg-[#A4AA88]/20 text-[#2B411C]', icon: <FaMedal className="mr-1" /> },
      NORMAL: { color: 'bg-[#5B7742]/20 text-[#5B7742]', icon: <FaCheckCircle className="mr-1" /> },
      ABNORMAL: { color: 'bg-[#A4AA88]/20 text-[#2B411C]', icon: <FaTimesCircle className="mr-1" /> },
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
      {/* User Profile Header - Updated with new color scheme */}
      <div className="bg-gradient-to-r from-[#2B411C] to-[#4C5D34] rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            {user.profileimage ? (
              <img 
                src={user.profileimage} 
                alt="Profile" 
                className="w-48 h-48 rounded-lg border-4 border-white/30 object-cover shadow-md"
              />
            ) : (
              <div className="w-36 h-36 rounded-lg bg-white/10 flex items-center justify-center border-4 border-white/30 shadow-md">
                <FaUser className="text-4xl text-white/80" />
              </div>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-[#A4AA88] font-medium tracking-wider">{user.armyNo}-{user.rank}</div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">{user.name}</h1>
          </div>
        </div>
      </div>

      {/* Basic Info - Updated with new color scheme */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#A4AA88]/30">
        <div className="bg-[#4C5D34] px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FaUser className="mr-2 text-[#A4AA88]" />
            Basic Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#5B7742]">Full Name</label>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#5B7742]">Army Number</label>
              <p className="text-gray-900 font-medium">{user.armyNo}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#5B7742]">Rank</label>
              <p className="text-gray-900 font-medium">{user.rank}</p>
            </div>
          </div>
        </div>
      </div>

      {/* BCM Tests - Updated with new color scheme */}
      {user.bcmTests?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#A4AA88]/30">
          <div className="bg-[#4C5D34] px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FaFlask className="mr-2 text-[#A4AA88]" />
              Body Composition Measurements
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#A4AA88]/30">
              <thead className="bg-[#5B7742]/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Test Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Height</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">BMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">PBF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Target Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Weight Control</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Fat Control</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Muscle Control</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Hb</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">
                    <div className="flex items-center">
                      <GiBodyBalance className="mr-1" />
                      Balance
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#A4AA88]/30">
                {user.bcmTests.map((test, index) => {
                  const bmiStatus = checkBMIStatus(test.bmi);
                  const pbfStatus = checkPBFStatus(test.pbf);
                  const hbStatus = checkHBStatus(test.hb);
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#A4AA88]/10'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2B411C]">{test.testdates}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2B411C]">{test.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2B411C]">{test.height}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2B411C]">{test.weight}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        bmiStatus === 'PASS' ? 'text-[#5B7742]' : 'text-[#A4AA88]'
                      }`}>
                        {test.bmi}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        pbfStatus === 'PASS' ? 'text-[#5B7742]' : 'text-[#A4AA88]'
                      }`}>
                        {test.pbf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4C5D34]">{test.targetWeight}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4C5D34]">{test.weightControl}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4C5D34]">{test.bfmControl}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4C5D34]">{test.ffmControl}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        hbStatus === 'PASS' ? 'text-[#5B7742]' : 'text-[#A4AA88]'
                      }`}>
                        {test.hb}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4C5D34]">{test.bodyBalance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BDM Tests - Updated with new color scheme */}
      {user.bdmTests?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#A4AA88]/30">
          <div className="bg-[#4C5D34] px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FaBone className="mr-2 text-[#A4AA88]" />
              Bone Density Measurements
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#A4AA88]/30">
              <thead className="bg-[#5B7742]/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Test Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">T-Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#A4AA88]/30">
                {user.bdmTests.map((test, index) => {
                  const tScoreMatch = test.tScore?.match(/\(?(-?\d+\.\d+)/);
                  const tScoreValue = tScoreMatch ? parseFloat(tScoreMatch[1]) : null;
                  const tScoreDisplay = tScoreValue !== null ? tScoreValue.toFixed(2) : '-';
                  const bdmStatus = getBDMStatus(test.tScore);
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#A4AA88]/10'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2B411C]">{test.testdates}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4C5D34]">{test.tScore} </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={bdmStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4C5D34]">{test.remarks || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BPET Tests - Updated with new color scheme */}
      {user.bpetTests?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#A4AA88]/30">
          <div className="bg-[#4C5D34] px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FaRunning className="mr-2 text-[#A4AA88]" />
              Basic Physical Efficiency Tests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#A4AA88]/30">
              <thead className="bg-[#5B7742]/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Test Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">5km Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">60m Sprint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Vertical Rope</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Horizontal Rope</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">9ft Ditch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#A4AA88]/30">
                {user.bpetTests.map((test, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#A4AA88]/10'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2B411C]">{test.testDate}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      test.fivekmrunning === 'EX' ? 'text-[#4C5D34]' : 
                      test.fivekmrunning === 'PASS' ? 'text-[#5B7742]' : 
                      test.fivekmrunning === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                    }`}>
                      {test.fivekmrunning}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      test.sixtymsprint === 'EX' ? 'text-[#4C5D34]' : 
                      test.sixtymsprint === 'PASS' ? 'text-[#5B7742]' : 
                      test.sixtymsprint === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                    }`}>
                      {test.sixtymsprint}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      test.verticalrope === 'EX' ? 'text-[#4C5D34]' : 
                      test.verticalrope === 'PASS' ? 'text-[#5B7742]' : 
                      test.verticalrope === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                    }`}>
                      {test.verticalrope}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      test.horizontalrope === 'EX' ? 'text-[#4C5D34]' : 
                      test.horizontalrope === 'PASS' ? 'text-[#5B7742]' : 
                      test.horizontalrope === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                    }`}>
                      {test.horizontalrope}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      test.nineftditch === 'EX' ? 'text-[#4C5D34]' : 
                      test.nineftditch === 'PASS' ? 'text-[#5B7742]' : 
                      test.nineftditch === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
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

      {/* PPT Tests - Updated with new color scheme */}
      {user.pptTests?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#A4AA88]/30">
          <div className="bg-[#4C5D34] px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MdFitnessCenter className="mr-2 text-[#A4AA88]" />
              Physical Proficiency Tests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#A4AA88]/30">
              <thead className="bg-[#5B7742]/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Test Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Chin Up</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Sit Up</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Toe Touch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">100m Sprint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">2.4km Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">5m Shuttle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2B411C] uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#A4AA88]/30">
                {user.pptTests.map((test, index) => {
                  const chinUpStatus = checkChinUpStatus(test.chinup);
                  const sitUpStatus = checkSitUpStatus(test.situp);
                  const toeTouchStatus = checkToeTouchStatus(test.toetouch);
                  const sprintStatus = checkHundredMtrSprintStatus(test.hundredmtrsprint);
                  const runStatus = checkTwoPointFourKmRunStatus(test.twopointfourkmrun);
                  const shuttleStatus = checkFiveMtrShuttleStatus(test.fivemtrshuttle);
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#A4AA88]/10'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2B411C]">{test.testdates}</td>
                      
                      {/* Chin Up */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        chinUpStatus === 'EX' ? 'text-[#4C5D34]' : 
                        chinUpStatus === 'PASS' ? 'text-[#5B7742]' : 
                        chinUpStatus === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                      }`}>
                        {test.chinup}
                      </td>
                      
                      {/* Sit Up */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        sitUpStatus === 'EX' ? 'text-[#4C5D34]' : 
                        sitUpStatus === 'PASS' ? 'text-[#5B7742]' : 
                        sitUpStatus === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                      }`}>
                        {test.situp}
                      </td>
                      
                      {/* Toe Touch */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        toeTouchStatus === 'EX' ? 'text-[#4C5D34]' : 
                        toeTouchStatus === 'PASS' ? 'text-[#5B7742]' : 
                        toeTouchStatus === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                      }`}>
                        {test.toetouch}
                      </td>
                      
                      {/* 100m Sprint */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        sprintStatus === 'EX' ? 'text-[#4C5D34]' : 
                        sprintStatus === 'PASS' ? 'text-[#5B7742]' : 
                        sprintStatus === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                      }`}>
                        {test.hundredmtrsprint}
                      </td>
                      
                      {/* 2.4km Run */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        runStatus === 'EX' ? 'text-[#4C5D34]' : 
                        runStatus === 'PASS' ? 'text-[#5B7742]' : 
                        runStatus === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                      }`}>
                        {test.twopointfourkmrun}
                      </td>
                      
                      {/* 5m Shuttle */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        shuttleStatus === 'EX' ? 'text-[#4C5D34]' : 
                        shuttleStatus === 'PASS' ? 'text-[#5B7742]' : 
                        shuttleStatus === 'FAIL' ? 'text-[#A4AA88]' : 'text-gray-500'
                      }`}>
                        {test.fivemtrshuttle}
                      </td>
                      
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