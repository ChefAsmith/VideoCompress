const fg = require('fast-glob');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

async function compressFolder(inputDir) {
  const outputDir = path.join(inputDir, '_compressed');
  const files = await fg(['**/*.mp4', '**/*.mkv'], {
    cwd: inputDir,
    absolute: true,
  });

  let results = [];

  for (const file of files) {
    const relPath = path.relative(inputDir, file);
    const outputPath = path.join(outputDir, relPath).replace(/\.(mp4|mkv)$/i, '.mp4');

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const cmd = `HandBrakeCLI -i "${file}" -o "${outputPath}" -e x265 -q 23 -E av_aac --audio-bitrate 128 --optimize --all-subtitles --subtitle-burned=none --markers`;

    try {
      await execPromise(cmd);
      results.push({ file, status: 'done' });
    } catch (err) {
      results.push({ file, status: 'failed', error: err });
    }
  }

  return results;
}

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
      err ? reject(stderr || stdout) : resolve(stdout);
    });
  });
}

module.exports = { compressFolder };
