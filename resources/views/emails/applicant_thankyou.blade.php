<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Başvurunuz Alındı</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .success-icon { font-size: 48px; text-align: center; display: block; margin-bottom: 15px; }
        .info-box { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: bold; width: 150px; color: #666; }
        .info-value { flex: 1; }
        .reference-box { background: #EEF2FF; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .reference-no { font-size: 24px; font-weight: bold; color: #4F46E5; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Başvurunuz Alındı</h1>
    </div>
    
    <div class="content">
        <span class="success-icon">✓</span>
        
        <p>Merhaba,</p>
        <p>Başvurunuz başarıyla alınmıştır. En kısa sürede size dönüş yapacağız.</p>
        
        <div class="reference-box">
            <p style="margin: 0 0 10px 0; color: #666;">Referans Numaranız:</p>
            <p class="reference-no">{{ $referenceNo }}</p>
        </div>
        
        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Başvuru Formu:</span>
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
        
        <p>Başvurunuzun durumunu takip etmek için referans numaranızı kullanabilirsiniz.</p>
        
        <p>İyi günler dileriz.</p>
    </div>
    
    <div class="footer">
        <p>Bu email otomatik olarak gönderilmiştir.</p>
    </div>
</body>
</html>