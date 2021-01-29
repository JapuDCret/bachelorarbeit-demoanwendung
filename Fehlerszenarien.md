# Fehlerszenarien

Die Demoanwendung soll beispielhaft eine fehlerbehaftete Webanwendung darstellen. Aus diesem Grund wurden synthetische Fehler eingebaut, die folgend beschrieben werden.

## Szenarien

### "Keine Übersetzungen"

- Problem: Nutzer berichten, dass manchmal die Webanwendung beim Start keine Artikeltexte anzeigt.

- Ursache: Einer der "localization-svc" Pods hat eine defekte Konfiguration.

### "Gültige Straßen sind ungültig"

- Problem: Nutzer berichten, dass Ihr Straßenname nicht eingeben werden kann. Beispielsweise die Eingabe "Ährenweg" führt zu einem Fehler.

- Ursache: Der "address-validation-svc" validiert Straßen mit dem RegEx `[a-zA-Z\,\-\ ]+`, welches keine gängigen Sonderzeichen (ä ,ö ,ü, ß) erlaubt.

### "Gültige Hausnummern sind ungültig"

- Problem: Nutzer berichten, dass Hausnummern, die nicht nur aus Zahlen bestehen, zum Fehler führen.

- Ursache: Der "address-validation-svc" validiert Hausnummern als Zahl und schlägt im o.g. Fall in der Konvertierung fehl.

### "Gültige Städte sind ungültig"

- Problem: Nutzer aus Gießen berichten, dass Sie das Formular zur Rechnungsadresse nicht ausfüllen können

- Ursache: Der "address-validation-svc" meldet die Stadt "Gießen" als ungültig, weil sie nicht in der lokalen Tabelle vorhanden ist.

### "Ungültige Adressen sind gültig"

- Problem: Nutzer können in den Lieferdaten ungültige Eingaben tätigen und absenden, bei der Bestellaufgabe kommt es zu einem Fehler.

- Ursache: Das Frontend überprüft lediglich die Rechnungsadresse, aber nicht die Lieferadresse.

### "Vor- und Nachnamen werden abgeschnitten"

- Problem: Nutzer berichten, dass in der Bestellbestätigung Ihre Vor- und Nachnamen abgeschnitten dargestellt werden.

- Ursache: Der "order-svc" begrenzt den Vor- sowie den Nachnamen auf 20 Zeichen, das Frontend begrenzt dies jedoch nicht.

### "Falsche Zahlungsart"

- Problem: Nutzer berichten, dass in der Bestellbestätigung die falsche Zahlungsart angezeigt wird. In der Bestellübersicht wurde jedoch die korrekte Zahlungsart angezeigt.

- Ursache: Das Frontend sendet alle Formulardaten jeder Rechnungsart an "order-svc". Dieser nimmt aber an, dass alle nicht ausgewählten Rechnungsarten statt Formulardaten nur `null` enthalten.

### "Lange Verarbeitung"

- Problem: Beim Absenden des Formulars auf der Seite "Warenkorb" kommt es zu einer unerwünschten Wartezeit (von min. 6-10s).

- Ursache: Dies ist eine simulierte Wartezeit im Frontend je nach Anzahl der Positionen, um eine ineffiziente Verarbeitung nachzuahmen.


## Vorschläge

1. "PayPal Eingaben werden nicht validiert"

    Beim Formular "Zahlungsdaten" wird die Validierung für das Unterformular zur Zahlungsart PayPal ignoriert.