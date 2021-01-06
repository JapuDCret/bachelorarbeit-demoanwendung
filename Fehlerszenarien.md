# Fehlerszenarien

Die Demoanwendung soll beispielhaft eine fehlerbehaftete Webanwendung darstellen. Aus diesem Grund wurden synthetische Fehler eingebaut, die folgend beschrieben werden.

## Szenarien

1. "Lange Verarbeitung" (Vorschlag)

    Beim Absenden des Formulars auf der Seite "Warenkorb", kommt es zu einer unerwünschten Wartezeit (von min. 5s).
    - Dies soll eine ineffiziente Verarbeitung simulieren

2. "Serverfehler bei Adressüberprüfung" (Vorschlag)

    Beim Absenden des Formulars auf der Seite "Rechnungsadresse" sowie "Lieferadresse", soll die Adressprüfung für unbekannte Eingaben fehlschlagen.
    - Dies kann durch leicht falsche Eingaben des Nutzers passieren (bspw. "Gießen" anstelle von "Giessen")

3. "PayPal Eingaben werden nicht validiert" (Vorschlag)

    Beim Formular "Zahlungsdaten" wird die Validierung für das Unterformular zur Zahlungsart PayPal ignoriert.

4. "Falsches Datenmodell" (Vorschlag)

    Beim Formular "Zahlungsdaten" lassen sich unterschiedliche Daten je nach Zahlungsart eingeben.
    Werden Daten für zwei Zahlungsarten ausgefüllt, so sollen beide Datensätze an das Backend gesendet werden. Dies führt im Backend zu einem Fehler.
    - Dies soll einen Edge-Case repräsentieren, der nicht berücktsichtigt worden ist.

5. "Teilweise defekte Instanzen" (Vorschlag)

    Es soll ein Lokalisierungsdienst hinzugenommen werden, der verteilt als Cluster läuft.
    Eine Instanz im Cluster soll fehlerbehaftet sein (es fehlt eine Konfigurationsdatei o. Ä.).
    - Ssomit ist dieser Fehler nur gut über Tracing identifizierbar