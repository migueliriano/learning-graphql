const videoA = {
  id: '1',
  title: 'video A',
  duration: 180,
  release: true
};

const videoB = {
  id: '2',
  title: 'video B',
  duration: 100,
  release: false
};

const videos = [videoA, videoB];

const getVideoById = id => new Promise(resolve => {
  const [video] = videos.filter(video => {
    return video.id === id;
  });
  resolve(video);
});

const getVideos = () => new Promise(resolve => resolve(videos))

const createVideo = ({ title, duration, release}) => {
  const video = {
    id: (new Buffer(title, 'utf8')).toString('base64'),
    title,
    duration,
    release,
  };

  videos.push(video);

  return video;
}

exports.getVideoById = getVideoById;
exports.getVideos = getVideos;
exports.createVideo = createVideo;
