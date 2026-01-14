import styles from "@/styles/components/Header.module.scss";
import Image from "next/image";

export default function Header() {
    return (
        <header className={styles.header}>
            <a className={styles.brand} href="https://studioarchetype.net/" target={"_blank"}>
                <div className={styles.brandImage}>
                    <Image
                        src={"/logo.svg"}
                        alt={"Volmit Software Logo"}
                        fill
                    />
                </div>
                <div className={styles.brandName}>
                    <h1>
                        <span>Volmit</span>Software
                    </h1>
                </div>
            </a>
        </header>
    );
}