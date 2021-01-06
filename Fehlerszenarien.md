# Fehlerszenarien

Die Demoanwendung soll beispielhaft eine fehlerbehaftete Webanwendung darstellen. Aus diesem Grund wurden synthetische Fehler eingebaut, die folgend beschrieben werden.

## Szenarien

1. "Lange Verarbeitung" (Vorschlag)

    Beim Absenden des Formulars auf der Seite "Warenkorb", kommt es zu einer unerwünschten Wartezeit
    - Dies soll eine ineffiziente Verarbeitung simulieren

2. "Serverfehler bei Adressüberprüfung" (Vorschlag)

    Beim Absenden des Formulars auf der Seite "Rechnungsadresse" sowie "Lieferadresse", soll die Adressprüfung für valide Eingaben fehlschlagen können (Vorschlagen)
    - Dies soll einen Fehler in der Infrastruktur (bspw. Rate-Limit) simulieren
    - Ggf. kann man zwei Instanzen des Adressprüfungs-Services aufsetzen und einer der beiden liefert Fehler (somit ist dieser Fehler nur gut über Tracing identifizierbar)

3. "Falsches Datenmodell" (Vorschlag)

    Beim Formular "Zahlungsdaten" lassen sich unterschiedliche Daten je nach Zahlungsart eingeben.
    Werden Daten für zwei Zahlungsarten ausgefüllt, so sollen beide Datensätze an das Backend gesendet werden. Dies führt im Backend zu einem Fehler.
    - Dies soll einen Edge-Case repräsentieren, der nicht berücktsichtigt worden ist.