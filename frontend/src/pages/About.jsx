import { Target, Eye, Users2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("about.title")}</h1>
        <p>{t("about.intro")}</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 10 }}>{t("about.problemTitle")}</h3>
        <p className="text-muted">{t("about.problemText")}</p>
      </div>

      <div className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ marginBottom: 10 }}>{t("about.solutionTitle")}</h3>
        <p className="text-muted">{t("about.solutionText")}</p>
      </div>

      <div className="grid grid-3">
        <div className="card text-center">
          <Target size={26} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>{t("about.missionTitle")}</h3>
          <p className="text-muted" style={{ fontSize: 13.5 }}>{t("about.missionText")}</p>
        </div>
        <div className="card text-center">
          <Eye size={26} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>{t("about.visionTitle")}</h3>
          <p className="text-muted" style={{ fontSize: 13.5 }}>{t("about.visionText")}</p>
        </div>
        <div className="card text-center">
          <Users2 size={26} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>{t("about.teamTitle")}</h3>
          <p className="text-muted" style={{ fontSize: 13.5 }}>{t("about.teamText")}</p>
        </div>
      </div>
    </div>
  );
}
