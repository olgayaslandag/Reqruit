import { Link } from '@inertiajs/react';

export default function StatCard({ label, value, icon = '📊', color = 'text-primary', href }) {
    const content = (
        <div className="d-flex align-items-center">
            <div className="fs-4 me-3">{icon}</div>
            <div>
                <p className="small text-body-secondary mb-1">{label}</p>
                <p className={`fs-3 fw-bold mb-0 ${color}`}>{value ?? 0}</p>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="card border-0 shadow-sm p-3 text-decoration-none">
                {content}
            </Link>
        );
    }

    return (
        <div className="card border-0 shadow-sm p-3">
            {content}
        </div>
    );
}