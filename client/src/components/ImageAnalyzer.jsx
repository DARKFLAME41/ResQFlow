import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Eye, FileText } from 'lucide-react';
import { aiAPI } from '../services/api';

export const ImageAnalyzer = ({ onImageAnalyzed }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setImagePreview(base64Data);

      setLoading(true);
      try {
        const res = await aiAPI.analyzeImage({
          fileName: file.name,
          fileType: file.type
        });
        const result = res.data.imageAnalysis;
        setAnalysis(result);
        if (onImageAnalyzed) {
          onImageAnalyzed({
            fileName: file.name,
            previewUrl: base64Data,
            ...result
          });
        }
      } catch (err) {
        console.error('Image AI error:', err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-rose-500" />
          <h3 className="font-bold text-slate-100 text-sm">Image-Based Emergency Scene Analysis</h3>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          Computer Vision AI
        </span>
      </div>

      {/* File Upload Box */}
      <div className="border-2 border-dashed border-slate-800 hover:border-rose-500/60 rounded-xl p-6 text-center bg-slate-950/40 transition">
        <input
          type="file"
          accept="image/*"
          id="emergency-img-input"
          onChange={handleImageChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="space-y-3">
            <img
              src={imagePreview}
              alt="Emergency Scene Preview"
              className="max-h-48 mx-auto rounded-lg border border-slate-700 object-cover shadow-lg"
            />
            <label
              htmlFor="emergency-img-input"
              className="inline-flex items-center space-x-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> <span>Upload Different Photo</span>
            </label>
          </div>
        ) : (
          <label htmlFor="emergency-img-input" className="cursor-pointer space-y-2 block">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Click to upload emergency scene photo</p>
              <p className="text-[11px] text-slate-400">Accident scene, Fire, Flood, Building damage</p>
            </div>
          </label>
        )}
      </div>

      {/* AI Processing Spinner */}
      {loading && (
        <div className="flex items-center justify-center space-x-2 py-3 text-xs text-rose-400 font-semibold animate-pulse">
          <Eye className="w-4 h-4 animate-spin" />
          <span>Analyzing visual features and hazard markers...</span>
        </div>
      )}

      {/* AI Analysis Result Output Card */}
      {analysis && !loading && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Image AI Detection Result
            </span>
            <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
              Severity: {analysis.estimatedSeverity}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block">Detected Visual Indicators:</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
              {analysis.detected.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 bg-amber-950/30 border border-amber-800/50 rounded-lg text-[10px] text-amber-300 leading-snug">
            ⚠️ <strong>Disclaimer:</strong> {analysis.disclaimer}
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageAnalyzer;
