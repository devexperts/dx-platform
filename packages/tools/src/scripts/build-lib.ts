import * as gulp from 'gulp';
import '../tasks/ts-babel';
import '../tasks/copy-stylus';
import { PKG } from '../config/env';

console.log(`Building package "${PKG.name}"`);

gulp.start(['ts-babel', 'copy-stylus']);
