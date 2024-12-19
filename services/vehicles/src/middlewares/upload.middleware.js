const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware para processar a imagem
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { filename: image } = req.file;
    const imagePath = path.join('uploads', image);

    await sharp(req.file.path)
      .resize(800, 600, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(path.join('uploads', `processed_${image}`));

    // Remove o arquivo original
    fs.unlinkSync(req.file.path);

    // Atualiza o caminho do arquivo no request
    req.file.path = path.join('uploads', `processed_${image}`);
    req.file.filename = `processed_${image}`;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload: upload.single('foto'),
  processImage
}; 