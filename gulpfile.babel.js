import gulp from 'gulp';
import app from './index';

gulp.task('run', () => {
  app.listen(process.env.PORT || 3000);
});
