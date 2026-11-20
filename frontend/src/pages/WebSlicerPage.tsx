import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Box, CheckCircle2, Eye, FileUp, Loader2, Scissors, UploadCloud } from 'lucide-react';
import { api, type LibraryFileUploadResponse } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useUiSettings } from '../hooks/useUiSettings';
import { ModelViewerModal } from '../components/ModelViewerModal';
import { SliceModal } from '../components/SliceModal';

const ACCEPTED = '.3mf,.stl,.step,.stp,.obj,.amf';

export function WebSlicerPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const { data: settings } = useUiSettings();
  const [upload, setUpload] = useState<LibraryFileUploadResponse | null>(null);
  const [filename, setFilename] = useState('');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSlice, setShowSlice] = useState(false);

  const canUpload = hasPermission('library:upload');
  const canSlice = !!settings?.use_slicer_api && canUpload;

  async function importFile(file?: File) {
    if (!file) return;
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!ACCEPTED.split(',').includes(extension)) {
      showToast('Choose a supported model file (.3MF, .STL, .STEP, .OBJ or .AMF).', 'error');
      return;
    }
    if (!canUpload) {
      showToast('Your account does not have permission to upload and slice models.', 'error');
      return;
    }
    setBusy(true);
    setUpload(null);
    setFilename(file.name);
    try {
      const result = await api.uploadLibraryFile(file, null, true);
      setUpload(result);
      showToast('Model added to your Bambuddy library.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Model upload failed.', 'error');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    void importFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void importFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-3 sm:p-6 space-y-5">
      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-bambu-green/10 p-3 text-bambu-green"><Scissors className="h-6 w-6" /></div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Web Slicer</h1>
            <p className="text-sm text-bambu-gray">Prepare a model and slice it for your Bambu printer.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${dragging ? 'border-bambu-green bg-bambu-green/10' : 'border-bambu-dark-tertiary bg-bambu-dark-secondary'}`}
        >
          {busy ? <Loader2 className="mb-3 h-10 w-10 animate-spin text-bambu-green" /> : <UploadCloud className="mb-3 h-10 w-10 text-bambu-green" />}
          <h2 className="text-lg font-semibold text-white">{busy ? 'Importing model…' : 'Upload a 3D model'}</h2>
          <p className="mt-2 max-w-md text-sm text-bambu-gray">Drop a model here or choose a file from your device. Supported extensions: 3MF, STL, STEP, OBJ and AMF.</p>
          <button type="button" disabled={busy || !canUpload} onClick={() => inputRef.current?.click()} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-bambu-green px-5 py-2.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            Choose model
          </button>
          <input ref={inputRef} type="file" accept={ACCEPTED} onChange={onInputChange} className="hidden" />
          {!canUpload && <p className="mt-3 text-xs text-amber-300">Library upload permission is required.</p>}
        </div>

        <aside className="rounded-2xl border border-bambu-dark-tertiary bg-bambu-dark-secondary p-5 space-y-4">
          <h2 className="font-semibold text-white">Slicing workflow</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bambu-green/15 text-bambu-green">1</span><span className="text-bambu-gray">Upload a model into your Bambuddy library.</span></li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bambu-green/15 text-bambu-green">2</span><span className="text-bambu-gray">Preview the model and inspect its geometry.</span></li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bambu-green/15 text-bambu-green">3</span><span className="text-bambu-gray">Choose printer, filament and process presets in the slicer dialog.</span></li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bambu-green/15 text-bambu-green">4</span><span className="text-bambu-gray">Generate and download the slicer's output from the slice-job notification.</span></li>
          </ol>
          <div className="rounded-lg bg-bambu-dark p-3 text-xs text-bambu-gray">
            Uses Bambuddy's existing OrcaSlicer / Bambu Studio slicing pipeline and preset catalogue. The browser does not run a slicer binary locally.
          </div>
          {!canSlice && <p className="text-xs text-amber-300">Enable Settings → Slicer → Use Slicer API to enable in-app slicing.</p>}
        </aside>
      </section>

      {upload && (
        <section className="rounded-2xl border border-bambu-green/30 bg-bambu-dark-secondary p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-xl bg-bambu-green/10 p-3 text-bambu-green"><Box className="h-6 w-6" /></div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm text-bambu-green"><CheckCircle2 className="h-4 w-4" /> Model imported</div>
                <h3 className="truncate font-semibold text-white">{filename}</h3>
                <p className="text-xs text-bambu-gray">Library file #{upload.id} · {upload.file_type.toUpperCase()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button type="button" onClick={() => setShowPreview(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-bambu-dark-tertiary px-4 text-sm text-white hover:bg-bambu-dark"><Eye className="h-4 w-4" /> Preview</button>
              <button type="button" disabled={!canSlice} onClick={() => setShowSlice(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-bambu-green px-4 text-sm font-semibold text-black disabled:opacity-50"><Scissors className="h-4 w-4" /> Slice model</button>
            </div>
          </div>
        </section>
      )}

      {upload && showPreview && (
        <ModelViewerModal
          libraryFileId={upload.id}
          title={filename}
          fileType={upload.file_type}
          onClose={() => setShowPreview(false)}
          onSliceWithBambuddy={canSlice ? () => { setShowPreview(false); setShowSlice(true); } : undefined}
        />
      )}
      {upload && showSlice && (
        <SliceModal
          source={{ kind: 'libraryFile', id: upload.id, filename }}
          onClose={() => setShowSlice(false)}
        />
      )}
    </div>
  );
}

export default WebSlicerPage;
