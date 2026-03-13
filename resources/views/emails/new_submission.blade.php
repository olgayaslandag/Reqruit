<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yeni Başvuru</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: bold; width: 150px; color: #666; }
        .info-value { flex: 1; }
        .btn { display: inline-block; background: #4F46E5; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Yeni Başvuru</h1>
    </div>
    
    <div class="content">
        <p>Merhaba,</p>
        <p>Yeni bir başvuru formu gönderildi. Aşağıda detayları bulabilirsiniz:</p>
        
        <div class="info-box">
            @if($applicantName)
            <div class="info-row">
                <span class="info-label">Başvuran:</span>
                <span class="info-value">{{ $applicantName }}</span>
            </div>
            @endif
            <div class="info-row">
                <span class="info-label">Referans No:</span>
                <span class="info-value">{{ $referenceNo }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Form:</span>
                <span class="info-value">{{ $formName }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Departman:</span>
                <span class="info-value">{{ $departmentName }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tarih:</span>
                <span class="info-value">{{ $submittedAt }}</span>
            </div>
        </div>
        
        <a href="{{ $adminUrl }}" class="btn">Başvuruyu İncele</a>
    </div>
    
    <div class="footer">
        <p>Bu email otomatik olarak gönderilmiştir.</p>
    </div>
</body>
</html>