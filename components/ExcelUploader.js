import { useState } from 'react';

export default function ExcelUploader() {
  const [files, setFiles] = useState({
    BCM: null,
    BDM: null,
    BPET: null,
    PPT: null,
  });
  const [batchnumber, setBatchnumber] = useState('AV001');
  const [testDate, setTestDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  const handleFileChange = (e, type) => {
    setFiles(prev => ({
      ...prev,
      [type]: e.target.files[0]
    }));
    setError('');
    setMessage('');
    setDebugInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.BCM && !files.BDM && !files.BPET && !files.PPT) {
      setError('Please select at least one file (BCM, BDM, BPET, or PPT)');
      return;
    }
    const validExtensions = ['.xlsx', '.xls'];
    const invalidFiles = Object.entries(files)
      .filter(([type, file]) => file && !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))
      .map(([type]) => type);
  
    if (invalidFiles.length > 0) {
      setError(`Invalid file type for: ${invalidFiles.join(', ')}. Please upload .xlsx or .xls files.`);
      return;
    }
    
    if (!testDate) {
      setError('Please select a test date');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');
    setDebugInfo(null);

    const formData = new FormData();
    if (files.BCM) formData.append('bcmFile', files.BCM);
    if (files.BDM) formData.append('bdmFile', files.BDM);
    if (files.BPET) formData.append('bpetFile', files.BPET);
    if (files.PPT) formData.append('pptFile', files.PPT);
    formData.append('batchnumber', batchnumber);
    formData.append('testDate', testDate);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Successfully imported data for ${data.count} users in batch ${data.batchnumber} (${data.testDate})`);
        setDebugInfo(data.sampleData);
        setFiles({ BCM: null, BDM: null,BPET: null,PPT:null });
        setTestDate('');
        e.target.reset();
      } else {
        setError(data.message || 'Error uploading files');
        setDebugInfo(data);
      }
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Data Importer</h2>
          <p className="mt-2 text-lg text-gray-600">
            Upload your Excel files to import data
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="batchnumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <select
                    id="batchnumber"
                    value={batchnumber}
                    onChange={(e) => setBatchnumber(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-gray-50 transition duration-150"
                    required
                  >
                    <option value="AV001">AV001</option>
                    <option value="AV002">AV002</option>
                    <option value="AV003">AV003</option>
                    <option value="AV004">AV004</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="testDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Test Date
                  </label>
                  <input
                    type="date"
                    id="testDate"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-gray-50 transition duration-150"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Body Composition Measurement (BCM) File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="bcm-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload BCM file</span>
                          <input
                            id="bcm-upload"
                            name="bcm-upload"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e, 'BCM')}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">XLSX or XLS up to 10MB</p>
                      {files.BCM && (
                        <p className="text-sm text-indigo-600 font-medium mt-2">
                          Selected: {files.BCM.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bone Density Measurement (BDM) File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="bdm-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload BDM file</span>
                          <input
                            id="bdm-upload"
                            name="bdm-upload"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e, 'BDM')}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">XLSX or XLS up to 10MB</p>
                      {files.BDM && (
                        <p className="text-sm text-indigo-600 font-medium mt-2">
                          Selected: {files.BDM.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                BPET File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="bpet-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload BPET file</span>
                          <input
                            id="bpet-upload"
                            name="bpet-upload"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e, 'BPET')}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">XLSX or XLS up to 10MB</p>
                      {files.BPET && (
                        <p className="text-sm text-indigo-600 font-medium mt-2">
                          Selected: {files.BPET.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
              PPT File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="ppt-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload PPT file</span>
                          <input
                            id="ppt-upload"
                            name="ppt-upload"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e, 'PPT')}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">XLSX or XLS up to 10MB</p>
                      {files.PPT && (
                        <p className="text-sm text-indigo-600 font-medium mt-2">
                          Selected: {files.PPT.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Upload Data'}
                </button>
              </div>
            </form>

            {message && (
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {debugInfo && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Sample Data</h3>
                <div className="bg-gray-800 rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>{JSON.stringify(debugInfo, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Udyogya</p>
        </div>
      </div>
    </div>
  );
}