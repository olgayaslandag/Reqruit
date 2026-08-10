export default function DashboardSection({ title, subtitle, icon = '', children }) {
    return (
        <section className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
                {icon && <span className="fs-4">{icon}</span>}
                <div>
                    <h4 className="fw-bold mb-0">{title}</h4>
                    {subtitle && <p className="text-body-secondary mb-0 small">{subtitle}</p>}
                </div>
            </div>
            <div className="card border-0 shadow-sm p-4">{children}</div>
        </section>
    );
}