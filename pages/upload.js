import ExcelUploader from '../components/ExcelUploader';

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Patient Data Import</h1>
      <ExcelUploader />
    </div>
  );
}