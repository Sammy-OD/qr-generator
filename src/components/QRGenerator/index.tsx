import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [filename, setFilename] = useState('');
  const [filesize, setFilesize] = useState(0);
  const [fileError, setFileError] = useState('');
  const [image, setImage] = useState('');
  const [logoWidth, setLogoWidth] = useState(56);
  const [logoHeight, setLogoHeight] = useState(56);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length >0) {
      const file: File = e.target.files[0];

      if (file && file.size < 1048576) {

        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImage(reader.result.toString());
          } else {
            setFileError('Error reading the image.');
            setImage('');
          }
        };
        
        reader.readAsDataURL(file);
      }

      setFilename(file.name);
      setFilesize(file.size);
    }
  }

  const updateLogoWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoWidth(Number(e.target.value) * 1.2);
  }

  const updateLogoHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoHeight(Number(e.target.value) * 1.2);
  }

  const generateQR = async () => {
    setError('');
    setFileError('');

    if (!text) return setError('please enter a url');
    if (!filename) return setFileError('please select file');
    if (filesize > 1048576) return setFileError('File size too large!');

    setError('');
    setQRCodeUrl(text);
    setShow(true);
  }

  const handleDownload = async () => {
    const canvasElement = document.getElementById('canvas');
    if (canvasElement) {
      const canvas = (await html2canvas(canvasElement)).toDataURL();

      if (canvas) {
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        const filename = `qrcode-${timestamp}.png`;

        link.href = canvas;
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
      }
    }
  };

  const reset = ()=> {
    setText('');
    setFilename('');
    setFilesize(0);
    setShow(false);
    setLogoWidth(56);
    setLogoHeight(56);
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center h-full">
      <div className="w-full px-2 md:w-[380px]">
        <h1 className="text-5xl font-semibold text-blue-800 mb-5">QR Generator</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <input className="p-4 py-1 border-2 rounded-full border-blue-800 outline-blue-800 w-full" type="text" placeholder="Enter text or URL here..." value={text} onChange={handleInputChange} />
              {error && <p className="text-blue-800 text-sm mt-1">{error}</p>}
            </div>

            <div>
              <label
                htmlFor="fileInput"
                className="border-2 border-blue-800 pr-4 text-sm rounded-full inline-flex w-full items-center cursor-pointer truncate ..."
              >
                <span className="bg-blue-800 p-1.5 pl-4 pr-2 mr-2 rounded-l-full text-white">Choose logo</span> <span className="truncate ...">{filename}</span>
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpg, image/jpeg"
              />
            <span className="text-sm text-gray-500">Max file size (1MB).</span> {fileError && <span className="text-blue-800 text-sm mt-1">{fileError}</span>}
            </div>
          </div>
          <button onClick={generateQR} className="bg-blue-800 text-white p-2 rounded-full">Generate QR</button>
        </div>
      </div>
      
      {show && 
        <div className="flex flex-col gap-2">
          <div id="canvas">
            <QRCode value={qrCodeUrl} size={280} qrStyle="squares" logoImage={image} logoWidth={logoWidth} logoHeight={logoHeight} />
          </div>
          <div className="flex flex-col gap-1 px-2 mb-2">
            <label htmlFor="logowidth" className="text-sm">Logo Width</label>
            <input type="range" name="logowidth" id="logowidth" className="accent-blue-800 cursor-pointer" value={logoWidth/1.2} onChange={updateLogoWidth} />
            <label htmlFor="logoheight" className="text-sm">Logo Height</label>
            <input type="range" name="logoheight" id="logoheight" className="accent-blue-800 cursor-pointer" value={logoHeight/1.2} onChange={updateLogoHeight} />
          </div>
          <button onClick={handleDownload} className="bg-blue-800 text-white p-2 text-center rounded-full">Download</button>
          <button onClick={reset} className="bg-gray-800 text-white p-2 text-center rounded-full">Clear</button>
        </div>
      }
    </div>
  )
}

export default QRGenerator