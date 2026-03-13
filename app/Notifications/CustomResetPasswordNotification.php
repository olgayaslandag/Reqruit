<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPasswordNotification extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $appName = config('app.name', 'IK Yönetim');

        return (new MailMessage)
            ->subject('Şifre Sıfırlama Talebi - '.$appName)
            ->greeting('Merhaba!')
            ->line('Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın.')
            ->action('Şifremi Sıfırla', url(route('password.reset', ['token' => $this->token, 'email' => $notifiable->getEmailForPasswordReset()], false)))
            ->line('Bu bağlantı 60 dakika geçerlidir.')
            ->line('Bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.')
            ->salutation('Saygılarımızla, '.$appName);
    }

    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
