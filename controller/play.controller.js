const aws = require('aws-sdk'); //aws 설정을 위한 모듈

// aws 설정
aws.config.update({
  accessKeyId: 'AKIA3BCD7COSYA3ZBUXS',
  secretAccessKey: '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',
  region: 'ap-northeast-2',
});

const s3 = new aws.S3();

exports.getPlaytest = (req, res) => {
  res.render('playtest');
};

exports.getPlaySong = (req, res) => {
  let fileName = req.query.name; //확장자 포함돼 있어야함

  var params = { Bucket: 'kdt-wonno2', Key: fileName };

  // 클라이언트로부터의 스트리밍 범위 요청
  const range = req.headers.range;
  if (!range) {
    res.status(416).send('스트리밍 범위 헤더가 누락되었습니다.');
    return;
  }

  // headObject는 파일이 있나 없나 먼저 체크 용도로 이용
  s3.headObject(params, (err, data) => {
    if (err) {
      console.error('파일 크기를 가져오는 중 오류 발생:', err);
      res.status(500).send('스트리밍 중 오류가 발생했습니다.');
      return;
    }
    try{
      const fileSize = data.ContentLength; // 파일 크기 (바이트 단위)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);

      const MAX_CHUNK_SIZE = 250 * 1000;
      const _end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const end = Math.min(_end, start + MAX_CHUNK_SIZE - 1);

      const chunkSize = end - start + 1;

      // Content-Type 설정
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'audio/mpeg',
        'Content-Length': chunkSize,
        Connection: 'keep-alive',
      };

      // HTTP 206 Partial Content로 응답
      res.writeHead(206, headers);

      // S3에서 부분 스트리밍
      const s3Params = {
        Bucket: 'kdt-wonno2',
        Key: fileName,
        Range: `bytes=${start}-${end}`,
      };

      const s3Stream = s3.getObject(s3Params).createReadStream();
      s3Stream.on('error', (err) => {
        console.error('S3 스트리밍 중 오류 발생:', err);
        res.status(500).send('스트리밍 중 오류가 발생했습니다.');
      });

    
      s3Stream.pipe(res);
    }
    catch(err){
      console.log(err);
    }
    
  });
};
