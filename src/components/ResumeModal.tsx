import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParseText: (text: string) => void;
  onUploadFile: (fileData: { base64: string; mimeType: string; filename: string }) => void;
  loading: boolean;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  onParseText,
  onUploadFile,
  loading,
}) => {
  const [mode, setMode] = useState<'text' | 'upload'>('text');
  const [text, setText] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onParseText(text.trim());
    onClose();
  };

  const processFile = (file: File) => {
    setFileError(null);
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');

    if (!isPdf && !isTxt) {
      setFileError('Please select a valid PDF or TXT file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onUploadFile({
        base64,
        mimeType: file.type || (isPdf ? 'application/pdf' : 'text/plain'),
        filename: file.name,
      });
      onClose();
    };
    reader.onerror = () => {
      setFileError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Augment Profile with Resume / Text
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          If LinkedIn public signals were limited or private, supplying your resume text or document guarantees an exact, rich analysis without missing experience or skills.
        </p>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex-1 pb-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              mode === 'text'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Text</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 pb-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              mode === 'upload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF / TXT</span>
          </button>
        </div>

        {mode === 'text' ? (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your LinkedIn profile text, bio, or resume bullet points here..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || text.trim().length < 20}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Parse & Update
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/20">
              <Upload className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Choose a PDF or TXT resume document
              </p>
              <p className="text-[11px] text-slate-400 mb-4">Up to 15MB</p>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm">
                <span>Select File</span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processFile(e.target.files[0]);
                    }
                  }}
                  disabled={loading}
                />
              </label>

              {fileError && (
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-rose-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
