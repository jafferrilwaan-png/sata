const fs = require('fs');
const p = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

const targetStr = `        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              setIsModelMenuOpen((prev) => !prev);
            }}`;

const replStr = `        {!isSearchSubmitted && (
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              setIsModelMenuOpen((prev) => !prev);
            }}`;

c = c.replace(targetStr.replace(/\r\n/g, '\n'), replStr);
c = c.replace(targetStr.replace(/\n/g, '\r\n'), replStr.replace(/\n/g, '\r\n'));

// Now find closing of this div
const closeTargetStr = `              })}
            </div>
          )}
        </div>
      </div>
    </motion.form>`;

const closeReplStr = `              })}
            </div>
          )}
        </div>
        )}
      </div>
    </motion.form>`;

c = c.replace(closeTargetStr.replace(/\r\n/g, '\n'), closeReplStr);
c = c.replace(closeTargetStr.replace(/\n/g, '\r\n'), closeReplStr.replace(/\n/g, '\r\n'));

fs.writeFileSync(p, c, 'utf8');
console.log('Successfully hidden model selection menu when isSearchSubmitted is true!');
