# Advanced Lottery System - User Guide

## Getting Started

### 1. Login to the System
- Access the application through your Vercel link
- Enter the daily access code (format: `adminDDMMYYYY`)
- Verify via Telegram OTP
- You'll be taken to the Dashboard

### 2. Language Selection
The system supports three languages. Switch anytime using the buttons in the top-right:
- **UZ** - Uzbek
- **RU** - Russian
- **EN** - English

## Using the Lottery System

### Phase 1: Upload Data
1. Click the upload zone or drag & drop your Excel/CSV file
2. Supported formats: `.xlsx`, `.csv`, `.xls`
3. Wait for file processing (shows progress for large files)
4. Data table displays first 100 rows for verification

### Phase 2: Data Preparation
1. **Deduplication (Optional)**
   - Select a column to check for duplicates
   - Click "Remove Duplicates"
   - System shows how many duplicates were removed

2. **Configure Winners**
   - Select number of winners: 1, 2, 3, 5, or custom amount
   - Preview shows winner ranking layout
   - Click "Lock & Prepare Live Session"

### Phase 3: Live Draw (60-Second Animation)
1. You'll see "Ready for Live Broadcast" status
2. Click "Start Live Draw" to begin the 60-second selection
3. During the draw:
   - Timer counts 0-60 seconds
   - Participants cycle continuously
   - Progress bar fills
   - Animation is smooth and cinematic
4. At 60 seconds:
   - Winner(s) are automatically selected
   - Final results display with participant information
   - Modal shows results with podium layout (for 1-3 winners)

### Phase 4: View Winners

#### Single Winner Display
- Large centered card with gold/yellow theme
- Shows participant ID and additional data fields
- 🥇 First Place indicator

#### Multiple Winners Display
- **1st Place** (Top, center): Largest card, gold gradient
- **2nd Place** (Left): Silver gradient, medium size
- **3rd Place** (Right): Bronze gradient, medium size
- **4+ Winners**: Compact list format below podium

All winners show:
- Rank badge
- Participant ID
- First few data fields
- Animated sequential reveal

### Phase 5: Export Results

#### Excel Export
- File named: `winners.xlsx`
- Includes rank column
- All participant data preserved
- Ready for reports/records

#### JSON Export
- File named: `winners.json`
- Structured format with ranks
- Machine-readable format
- Contains: rank, participant index, all data fields

## Key Features

### Cryptographic Security
- All winner selection uses Web Crypto API
- No Math.random() used anywhere
- Winners determined in real-time during animation
- Transparent, verifiable process

### Multi-Language Support
- Full UI in Uzbek, Russian, and English
- Translations include:
  - All button labels
  - Informational messages
  - Data field descriptions
  - Winner titles (1st/2nd/3rd Place)

### Professional Animation
- Smooth 60-second draw duration
- Participant cycling animation
- Real-time progress tracking
- Cinematic winner reveal
- Responsive animations on all devices

## Tips for Best Results

### Preparing Your Data
1. Ensure your Excel file has:
   - First row can be headers or data
   - Consistent column count
   - No completely empty rows

2. Participant Identifier
   - Place unique ID/name in first column
   - This appears in winner display
   - Example: Email, Phone, ID Number

### Deduplication
- Choose column that identifies participants
- Email or ID columns work best
- Run before final selection
- Removes all but first occurrence

### Export & Reporting
- Always export results immediately
- Keep both Excel and JSON copies
- Excel for reports/presentations
- JSON for data processing

## Troubleshooting

### File Won't Upload
- Check file format (.xlsx or .csv only)
- Ensure file isn't corrupted
- Try with a smaller sample first
- Maximum recommended: 1M rows

### Draw Won't Start
- Verify you've locked a session
- Check "Ready for Live Broadcast" message displays
- Ensure winner count ≤ eligible participants
- Try refreshing if interface unresponsive

### Export Not Working
- Check browser allows downloads
- Disable popup blockers
- Ensure at least one winner selected
- Try different browser if persistent

### Language Not Changing
- Click language button again
- Refresh page
- Check browser console for errors
- Try different language

## Keyboard Shortcuts

- **Ctrl+Shift+O**: Toggle operator panel (if enabled)
- **Enter**: Submit forms in modals
- **Escape**: Close modals and dialogs

## System Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Cookie support enabled
- Download capability for export files

## Data Privacy

- All data processing happens client-side
- No data sent to external servers
- Refresh page clears all data
- Excel/CSV file never stored
- Winners determined locally in browser

## Best Practices

1. **Test First**: Run with sample data to verify process
2. **Backup Data**: Keep original file backup
3. **Verify Setup**: Check "Ready for Live Broadcast" before event
4. **Time It Right**: Ensure stable internet during draw
5. **Export Immediately**: Don't lose results by closing window
6. **Multilingual**: Use appropriate language for your audience

## Support & Documentation

- See `IMPLEMENTATION_SUMMARY.md` for technical details
- Check translation files in `lib/translations/` for all supported text
- Review `lib/live-draw-engine.ts` for randomization algorithm details

## Performance Notes

- Files up to 1M rows supported
- Smooth animation on modern devices
- Responsive design works on mobile
- Tested on Chrome, Firefox, Safari
- VPN/Proxy shouldn't affect operation

Enjoy your cryptographically secure winner selection!
