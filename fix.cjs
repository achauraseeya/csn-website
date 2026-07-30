const fs = require('fs');
let code = fs.readFileSync('src/components/AdminCentralDashboardModal.tsx', 'utf8');
code = code.replace(
`                    </div>
                <button`,
`                    </div>
                  </div>
                </div>
                <button`
);
fs.writeFileSync('src/components/AdminCentralDashboardModal.tsx', code);
