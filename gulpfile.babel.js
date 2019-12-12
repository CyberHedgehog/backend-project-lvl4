import gulp from 'gulp';
import app from './index';

gulp.task('run', () => {
  app.listen(3000);
});
