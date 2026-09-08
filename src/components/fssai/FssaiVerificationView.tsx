import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Layers, 
  Sparkles,
  ArrowRight,
  Award,
  Copy,
  Check,
  Upload,
  Camera,
  Loader2,
  Image as ImageIcon,
  ScanLine,
  RefreshCw
} from 'lucide-react';
import { fssaiVerificationService, FssaiDecodedDetails } from '../../services/fssaiVerificationService';
import { liveOcrService, OcrProgressUpdate } from '../../services/liveOcrService';

interface FssaiVerificationViewProps {
  onStartInspectionWithFssai?: (fssaiNumber: string, brand?: string) => void;
}

export const FssaiVerificationView: React.FC<FssaiVerificationViewProps> = ({
  onStartInspectionWithFssai
}) => {
  const [inputNumber, setInputNumber] = useState<string>('10014011000263'); // Default PepsiCo / Lay's Central FSSAI
  const [result, setResult] = useState<FssaiDecodedDetails>(() => 
    fssaiVerificationService.decodeFssaiNumber('10014011000263')
  );
  const [copied, setCopied] = useState(false);

  // Live Optical OCR States
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [ocrUploadedImage, setOcrUploadedImage] = useState<string | null>(null);
  const [ocrMessage, setOcrMessage] = useState<{ type: 'success' | 'warning' | 'info'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (numToSearch: string) => {
    const decoded = fssaiVerificationService.decodeFssaiNumber(numToSearch);
    setResult(decoded);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputNumber(val);
    if (val.replace(/\D/g, '').length >= 10) {
      handleSearch(val);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.rawNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processImageOcr = async (file: File) => {
    setIsOcrProcessing(true);
    setOcrProgress(0);
    setOcrStatusText('Loading Tesseract Optical Engine...');
    setOcrMessage(null);

    // Read and display thumbnail
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        setOcrUploadedImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    try {
      const extracted = await liveOcrService.recognizeImage(file, (update: OcrProgressUpdate) => {
        setOcrProgress(update.progress);
        setOcrStatusText(`${update.status} (${update.progress}%)`);
      });

      if (extracted.detectedFssaiNumber) {
        setInputNumber(extracted.detectedFssaiNumber);
        handleSearch(extracted.detectedFssaiNumber);
        setOcrMessage({
          type: 'success',
          text: `Optical OCR successfully extracted 14-digit FSSAI License: ${extracted.detectedFssaiNumber} (${extracted.confidence}% confidence)`
        });
      } else {
        setOcrMessage({
          type: 'warning',
          text: `OCR scanned the image (${extracted.confidence}% confidence), but could not find a distinct 14-digit FSSAI number. Please verify or enter it manually below.`
        });
      }
    } catch (err) {
      setOcrMessage({
        type: 'warning',
        text: 'Optical character recognition encountered an error processing this image format. Please enter the number manually.'
      });
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageOcr(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageOcr(file);
    }
  };

  const quickSamples = [
    { label: "Lay's / PepsiCo", number: "10014011000263" },
    { label: "Maggi / Nestlé", number: "10012011000168" },
    { label: "Amul GCMMF", number: "10012021000071" },
    { label: "Tata Sampann", number: "10014031001025" },
    { label: "Britannia", number: "10015042002228" },
    { label: "Parle-G", number: "10013022002497" },
    { label: "Haldiram's", number: "10014047000123" },
    { label: "Dabur Honey", number: "10016012000385" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                FSSAI FoSCoS Statutory Registry
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                14-Digit Format
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ScanLine className="w-3 h-3" />
                Live OCR Enabled
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              FSSAI License & Registration Verifier
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Verify statutory compliance, decode issuing state, registration year, jurisdiction, or upload a photo to extract the FSSAI number with live OCR.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://foscos.fssai.gov.in/verify-license-registration"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all border border-blue-400/30"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official FoSCoS Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* Live Optical OCR Upload Strip */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="bg-white rounded-2xl p-5 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
              {isOcrProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
              ) : (
                <Camera className="w-6 h-6 text-orange-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Upload Photo of Food Packet (Live Optical OCR)
                </h3>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.2 rounded-full font-bold">
                  Tesseract.js WASM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Drop an image of the packet or back label. The OCR engine reads the pixels and detects the 14-digit FSSAI sequence automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isOcrProcessing}
              className="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isOcrProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning Image...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select Packet Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live OCR Progress Bar */}
        {isOcrProcessing && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <ScanLine className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>{ocrStatusText}</span>
              </span>
              <span>{ocrProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, ocrProgress)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* OCR Result Notification */}
        {ocrMessage && !isOcrProcessing && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            ocrMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {ocrMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="font-medium">{ocrMessage.text}</span>
          </div>
        )}
      </div>

      {/* Input Search Box */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={inputNumber}
              onChange={handleInputChange}
              placeholder="Enter 14-digit FSSAI Number (e.g. 10014011000263)"
              className="block w-full pl-11 pr-24 py-3.5 border border-slate-300 rounded-xl text-slate-900 font-mono text-base sm:text-lg tracking-wider placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50"
              maxLength={20}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
              <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                inputNumber.replace(/\D/g, '').length === 14 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {inputNumber.replace(/\D/g, '').length}/14
              </span>
            </div>
          </div>

          <button
            onClick={() => handleSearch(inputNumber)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Verify License</span>
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try sample verified Indian brand licenses:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {quickSamples.map((sample) => (
              <button
                key={sample.number}
                onClick={() => {
                  setInputNumber(sample.number);
                  handleSearch(sample.number);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  inputNumber.replace(/\D/g, '') === sample.number
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Decoded Results Card */}
      {result && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Status Header */}
          <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            result.isValidFormat 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : 'bg-rose-50 border-rose-200'
          }`}>
            <div className="flex items-start sm:items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                result.isValidFormat ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {result.isValidFormat ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    result.isValidFormat ? 'bg-emerald-200/60 text-emerald-900' : 'bg-rose-200 text-rose-900'
                  }`}>
                    {result.status}
                  </span>
                  {result.isCentral && (
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Central FSSAI Authority
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 font-mono mt-1 tracking-wider flex items-center gap-2">
                  {result.formattedNumber}
                  <button 
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
                    title="Copy FSSAI Number"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={result.foscosPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span>Verify on FoSCoS</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              </a>
              {onStartInspectionWithFssai && result.isValidFormat && (
                <button
                  onClick={() => onStartInspectionWithFssai(result.rawNumber, result.verifiedOperator)}
                  className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Audit Commodity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Known FBO Details (if matched in official registry) */}
          {result.verifiedOperator && (
            <div className="bg-blue-50/50 p-6 border-b border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Official Registered Food Business Operator (FBO)
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {result.verifiedOperator}
                  </h3>
                  {result.businessAddress && (
                    <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                      <span>{result.businessAddress}</span>
                    </p>
                  )}
                  {result.permittedCategories && result.permittedCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {result.permittedCategories.map((cat, idx) => (
                        <span key={idx} className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded border border-blue-200 font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Statutory Breakdown Grid */}
          <div className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Statutory 14-Digit Breakdown (FSSAI FoSCoS Structure)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Digit 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Digit 1 (Category)</span>
                  <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                    {result.rawNumber.charAt(0) || '-'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {result.licenseCategory}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {result.rawNumber.charAt(0) === '1' ? 'Full Commercial License' : 'Small/Petty Business Reg.'}
                </p>
              </div>

              {/* Digits 2-3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Digits 2-3 (State)</span>
                  <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                    {result.stateCode}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 truncate" title={result.stateName}>
                  {result.stateName}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {result.isCentral ? 'National FSSAI Central HQ' : 'State Food Directorate'}
                </p>
              </div>

              {/* Digits 4-5 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Digits 4-5 (Reg. Year)</span>
                  <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                    {result.rawNumber.substring(3, 5) || '-'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  Year {result.registrationYear}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Initial enrollment date
                </p>
              </div>

              {/* Digits 6-14 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Digits 6-14 (ID & Serial)</span>
                  <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                    {result.registrarCode}-{result.serialNumber}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  DO-{result.registrarCode} / #{result.serialNumber}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Designated Officer & Serial
                </p>
              </div>
            </div>

            {/* Validation Notes & Legal Explanation */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Statutory Audit Analysis</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {result.validationNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
