const fs = require('fs');
const file = 'remix-remix-earthui-designer/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');
const target = '        }, 400);\r\n      }\r\n    }\r\n  }, []);';
const replacement = `        }, 400);
      }

      const modal = params.get('modal');
      if (modal === 'shortcuts') setIsShortcutsModalOpen(true);
      if (modal === 'profile' || modal === 'commander') setIsProfileModalOpen(true);
      if (modal === 'alerts') setIsAlertsModalOpen(true);
      if (modal === 'telemetry') {
        setSelectedSatellite({
          id: 'SAT-ISRO-CARTOSAT3',
          satellite_name: 'Cartosat-3 (High-Res 0.28m Optical)',
          mission: 'ISRO PSLV-C47 Sun-Synchronous',
          agency: 'ISRO',
          pass_time: '14:22:10 UTC',
          altitude_km: 508,
          velocity_kms: 7.61,
          inclination_deg: 97.4,
          status: 'TRACKING',
        });
      }

      const tab = params.get('tab');
      if (tab) setActiveTab(tab.toUpperCase());
    }
  }, []);`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content, 'utf8');
console.log('App.tsx successfully updated with modal & tab URL routing!');
